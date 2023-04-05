import React, {useState, useEffect, useCallback} from 'react';
import firebase from 'firebase/app';
import * as FileSystem from 'expo-file-system';
import * as FaceDetector from 'expo-face-detector';
import {Camera, CameraType} from 'expo-camera';
import {storage, auth, db} from '../../config/firebaseConfig';
import {
    TouchableOpacity,
    View,
    StyleSheet,
    Text,
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
                    updateRecents(user.uid).then(r => console.log(r));
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

    const CaptureButton = () => {
        const handlePressIn = () => {
            setCapturePressed(true);
        };

        const handlePressOut = () => {
            setCapturePressed(false);
        };

        return (
            <TouchableOpacity
                style={styles.captureButton}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}>
                {capturePressed ? (
                    <Text style={styles.captureButtonText}>Stop Capture</Text>
                ) : (
                    <Text style={styles.captureButtonText}>Capture</Text>
                )}
            </TouchableOpacity>
        );
    };

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
                padding: 5,
                borderRadius: 5,
                fontSize: fontSize,
            },
        });

        const personName = apiFace ? apiFaceName : 'API Loading...';

        return (
            <View style={boxStyles.faceBox}>
                <Text style={boxStyles.nameText}>{personName} with {confidence}% Confidence</Text>
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
        <View style={styles.container}>
            {pictureUploading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff"/>
                    <Text>Uploading image...</Text>
                </View>
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
                <CaptureButton/>
                <TouchableOpacity style={styles.flipButton} onPress={toggleCameraType}>
                    <Text style={styles.flipButtonText}>Flip</Text>
                </TouchableOpacity>
            </Camera>
            <View style={styles.personContainer}>
                {apiFaceNames && (
                    <View>
                        <Text style={styles.personText}>People in the room:</Text>
                        <FlatList
                            data={apiFaceNames}
                            renderItem={({item}) => <Text style={styles.personText}>{item}</Text>}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    camera: {
        flex: 1,
        borderWidth: 8,
        alignItems: 'center',
        borderColor: 'grey',
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        margin: 20,
    },
    button: {
        flex: 0.1,
        alignSelf: 'flex-end',
    },
    text: {
        fontSize: 40,
        color: 'white',
    },
    toggleContainer: {
        flex: 0.1,
    },
    toggleButton: {
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    toggleText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    personContainer: {
        flex: 0.1,
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
    },
    captureButton: {
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    captureButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
    }, flipButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
    }, flipButton: {
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    }
});

export default MLScreen;
