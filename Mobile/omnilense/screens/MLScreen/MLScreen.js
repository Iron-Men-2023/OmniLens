import React, {useState, useEffect, useCallback} from 'react';
import firebase from 'firebase/app';
import * as FileSystem from 'expo-file-system';
import * as FaceDetector from 'expo-face-detector';
import {Camera, CameraType} from 'expo-camera';
import {storage, auth, db} from '../../config/firebaseConfig';
import {
    Button,
    Surface,
    Caption,
    FAB,
    Text,
    Provider as PaperProvider,
    DefaultTheme,
    useTheme
} from 'react-native-paper';
import {
    TouchableOpacity,
    View,
    StyleSheet,
    Alert,
    ActivityIndicator, FlatList,
} from 'react-native';
import {
    fetchApiData,
    getUserByName,
    updateRecents, uriToBase64,
} from '../../config/DB_Functions/DB_Functions';


const MLScreen = () => {
    const [type, setType] = useState(CameraType.back);
    const [cameraRef, setCameraRef] = useState(null);
    const [faceLocations, setFaceLocations] = useState([]);
    const [capturePressed, setCapturePressed] = useState(false);
    const [apiFaceLocations, setApiFaceLocations] = useState([]);
    const [apiFaceNames, setApiFaceNames] = useState([]);
    const [pictureUploading, setPictureUploading] = useState(false);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [confidence, setConfidence] = useState(0.5);
    const [open, setOpen] = useState(false);
    const {theme} = useTheme();
    const {colors} = useTheme();

    async function recognizeFace(imageUri, num_of_faces) {
        const base64Image = await uriToBase64(imageUri);
        // Try sending as form data
        const formData = new FormData();
        formData.append('image', base64Image);
        formData.append('user_id', auth.currentUser.uid);
        formData.append('num_of_faces', num_of_faces);
        formData.append('device_sent_from', 'app');
        // console.log('form data: ', formData);
        const apiData = await fetchApiData(formData, '/api/facial_recognition');
        processApiData(apiData);
        // const jsonData = JSON.stringify({
        //     image: base64Image,
        //     user_id: auth.currentUser.uid,
        //     num_of_faces: num_of_faces,
        //     device_sent_from: "app"
        // });
        // const apiData = await fetchApiData(jsonData);
        // processApiData(apiData);
    }


    function processApiData(data) {
        console.log('data', data);
        if (!data || data.message === 'No face found' || !data.predicted_person || data.message === 'Error') {
            console.log(data?.message);
            setApiFaceNames([]);
            setApiFaceLocations([]);
            setConfidence(0);
            setPictureUploading(false);
            return;
        }

        const faceLocations = JSON.parse(data.face_loc);
        setApiFaceLocations(faceLocations);

        const faceNames = data.predicted_person.map((name, i) => {
            const processedName = name.split('_').join(' ').split('.')[0];
            if (i >= 1) {
                return ', ' + processedName;
            }
            return processedName;
        });
        setApiFaceNames(faceNames);

        // Additional logic to handle userByNameId, updating recents, etc.
        for (let i = 0; i < faceNames.length; i++) {
            getUserByName(faceNames[i]).then((user) => {
                console.log('user', user);
                if (user) {
                    if (user.uid !== auth.currentUser.uid) {
                        updateRecents(user.uid).then(r => console.log(r));
                    }
                }
            });
        }
        setConfidence(data.confidence);
        console.log('confidence', data.confidence);
        setPictureUploading(false);
    }

    const toggleCameraType = () => {
        setType(current =>
            current === CameraType.back ? CameraType.front : CameraType.back,
        );
    };
    const handleCameraPress = () => {
        setCapturePressed((prevCapturePressed) => !prevCapturePressed);
    };

    // const CaptureButton = () => {
    //
    //     return (
    //         <FAB
    //             style={styles.captureButton}
    //             onPress={handlePress}
    //             icon={capturePressed ? 'stop' : 'camera'}
    //             label={capturePressed ? 'Stop Capture' : 'Capture'}
    //         />
    //     );
    // };

    const FaceBox = ({face, apiFace, apiFaceName, confidence}) => {
        if (!face) {
            return null;
        }

        const top = face.bounds.origin.y - 10;
        const left = face.bounds.origin.x - 5;
        const height = face.bounds.size.height;
        const width = face.bounds.size.width;
        const fontSize = Math.min(height, width) / 10;
        const textBottom = top + height + 10;
        const textRight = left + width + 10;

        confidence = Math.round(confidence * 100);

        const boxStyles = StyleSheet.create({
            faceBox: {
                position: 'absolute',
                borderColor: 'red',
                borderWidth: 2,
                borderRadius: 10,
                top: top,
                left: left,
                width: width,
                height: height,
            },
            nameText: {
                position: 'absolute',
                bottom: -85,
                right: -15,
                color: 'red',
                padding: 15,
                borderRadius: 5,
                fontSize: fontSize,
            },
        });

        const personName = apiFace ? apiFaceName : 'API Loading...';

        return (
            <View style={boxStyles.faceBox}>
                <Caption style={boxStyles.nameText}>
                    {personName} with {confidence}% Confidence
                </Caption>
            </View>
        );
    };

    const handleFacesDetected = async ({faces, camera}) => {
        setFaceLocations(faces);
        if (!capturePressed || pictureUploading) {
            return;
        }
        if (capturePressed && !pictureUploading && faces.length > 0) {
            setPictureUploading(true);
            const photo = await camera.takePictureAsync();
            console.log('faces', faces.length);
            await recognizeFace(photo.uri, faces.length);
        }
    };

    const handleFaceDetectionError = error => {
        requestPermission().then(r => console.log(r));
        console.error('Error detecting faces:', error);
    };

    const handleCameraReady = ref => {
        setCameraRef(ref);
    }

    return (
        <PaperProvider theme={theme}>
            <View style={styles.container}>
                {pictureUploading && (
                    <Surface style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary}/>
                        <Caption>Uploading image...</Caption>
                    </Surface>
                )}
                <Camera
                    style={styles.camera}
                    ref={handleCameraReady}
                    type={type}
                    onCameraReady={requestPermission}
                    onFacesDetected={({faces}) =>
                        handleFacesDetected({faces, camera: cameraRef})
                    } onFaceDetectionError={handleFaceDetectionError}
                    faceDetectorSettings={{
                        mode: FaceDetector.FaceDetectorMode.accurate,
                        detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
                        runClassifications: FaceDetector.FaceDetectorClassifications.none,
                        minDetectionInterval: 2000,
                        tracking: true,
                    }}>
                    {faceLocations.map((face, index) => (
                        <FaceBox
                            key={index}
                            face={face}
                            apiFace={apiFaceLocations[index]}
                            apiFaceName={apiFaceNames[index]}
                            confidence={confidence[index]}
                        />
                    ))}
                    <FAB.Group
                        open={open}
                        style={[styles.fab, styles.fabGroup]}
                        icon={open ? 'close' : 'menu'}
                        actions={[
                            {
                                icon: type === CameraType.back ? 'camera-front' : 'camera-rear',
                                label: type === CameraType.back ? 'Front' : 'Back',
                                onPress: () => toggleCameraType(),
                                style: styles.fabAction, // Add this
                                labelStyle: styles.fabLabel, // Add this
                            },
                            {
                                icon: capturePressed ? 'stop' : 'camera',
                                label: capturePressed ? 'Stop Capture' : 'Capture',
                                onPress: () => handleCameraPress(),
                                style: styles.fabAction, // Add this
                                labelStyle: styles.fabLabel, // Add this
                            },
                        ]}
                        onStateChange={({open}) => setOpen(open)}
                        onPress={() => {
                            if (open) {
                                // set background to transparent
                            }
                        }}
                        visible={true}
                    />

                </Camera>
                <Surface style={styles.personContainer}>
                    {apiFaceNames && (
                        <View>
                            <Caption style={styles.personText}>People in the room:</Caption>
                            <FlatList
                                data={apiFaceNames}
                                renderItem={({item}) => <Caption style={styles.personText}>{item}</Caption>}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                    )}
                </Surface>
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
        padding: 5,
        borderRadius: 5,
    },
    camera: {
        flex: 1,
        alignItems: 'center',
    },
    personContainer: {
        flex: 0.1,
        justifyContent: 'center',
        /* make the surface transparent */
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 8,
        borderRadius: 5,
    },
    personText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20,
    },
    loadingContainer: {
        flex: 0.1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    flipButton: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        paddingHorizontal: 15,
        fontSize: 20,
    },
    captureButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        alignSelf: 'center',
    },
    fabGroup: {
        position: 'absolute',
        right: 0,
        paddingBottom: 0,
        backgroundColor: 'transparent',
    },
    fabAction: {
        backgroundColor: 'transparent',
        borderRadius: 0,
    },
    fabLabel: {
        color: 'black',
    },
});

export default MLScreen;
