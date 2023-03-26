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
    getUserByName,
    updateRecents,
} from '../../config/DB_Functions/DB_Functions';
import {GestureObjects as Sentry} from 'react-native-gesture-handler/src/handlers/gestures/gestureObjects';
import {manipulateAsync} from 'expo-image-manipulator';
import * as ImageManipulator from 'expo-image-manipulator';
import {debounce} from 'lodash';
import {uploadBytesResumable} from 'firebase/storage';
import {apiUrl} from "../../config";

const FaceRecognition = () => {
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [cameraRef, setCameraRef] = useState(null);
    const [person, setPerson] = useState(null);
    const [personIsSet, setPersonIsSet] = useState(false);
    const [cameraOn, setCameraOn] = useState(true);
    const [pictureUploading, setPictureUploading] = useState(false);
    const [faceLoc, setFaceLoc] = useState(null);
    const [capturePressed, setCapturePressed] = useState(false);
    const [apiFaceLoc, setApiFaceLoc] = useState(null);
    const [apiFaceNames, setApiFaceNames] = useState([]);
    const [capturedBounds, setCapturedBounds] = useState(null);

    // Set the cameraRef state variable when the camera is ready
    const handleCameraReady = ref => {
        setCameraRef(ref);
    };

    // Handle face detection events
    const handleFacesDetected = async ({faces, camera}) => {
        if (faces.length > 0) {
            let faceLocations = [];
            for (let i = 0; i < faces.length; i++) {
                let face = faces[i];
                faceLocations.push(face);
            }
            // console.log('Face detected', faceLocations);
            try {
                setFaceLoc(faceLocations);
            } catch (error) {
                console.log('Error in handleFacesDetected', error);
                setFaceLoc(null);
                return;
            }
        } else {
            setFaceLoc(null);
            return;
        }
        try {
            if (faces.length > 0) {
                if (pictureUploading) {
                    console.log('Picture is uploading');
                    return;
                }
                if (!capturePressed) {
                    return;
                }
                const photo = await camera.takePictureAsync();
                console.log('Photo taken:');
                recognizeFace(photo.uri).then(r => console.log(r));
            }
        } catch (error) {
            console.log('Error in handleFacesDetected', error);
        }
    };

    async function recognizeFace(imageUri) {
        const jsonData = JSON.stringify({path: path, user_id: userId});
        console.log('json data: ', jsonData);
        try {
            const response = await fetch(
                `${apiUrl}/api/facial_recognition`,
                {
                    method: 'POST',
                    body: jsonData,
                },
            );
            const data = await response.json();
            // console.log('Data: ', data);
            if (
                data.message === 'No face found' ||
                !data.predicted_person ||
                data.message === 'Error'
            ) {
                console.log(data.message);
                setPictureUploading(false);
                setPerson('Face Not Found');
                return 'No face found';
            }
            if (data.face_loc) {
                // Convert data.face_loc from str to dictionary
                let face_data1 = JSON.parse(data.face_loc);
                let face_data = [];
                for (let i = 0; i < face_data1.length; i++) {
                    let face = {};
                    face.top = face_data1[i].top;
                    face.right = face_data1[i].right;
                    face.bottom = face_data1[i].bottom;
                    face.left = face_data1[i].left;
                    face_data.push(face);
                }
                setApiFaceLoc(face_data);
            }
            for (let i = 0; i < data.predicted_person.length; i++) {
                data.predicted_person[i] = data.predicted_person[i].split('_').join(' ').split('.')[0];
                let name = data.predicted_person[i];
                if (i >= 1) {
                    data.predicted_person[i] = ', ' + data.predicted_person[i];
                }
                const userByNameId = await getUserByName(name);
                if (userByNameId) {
                    await updateRecents(userByNameId.uid);
                }
            }
            setPerson(data.predicted_person)
            setPersonIsSet(true);
            setPictureUploading(false);
            return data.predicted_person;
        } catch (e) {
            console.log('No person found OR Need to start server', e);
            setPictureUploading(false);
        }
        console.log('No person found OR Need to start server');
        return 'No person found OR Need to start server';
    }

    // Handle face detection errors
    const handleFaceDetectionError = error => {
        requestPermission().then(r => console.log(r));
        console.error('Error detecting faces:', error);
    };

    function toggleCameraType() {
        setType(current =>
            current === CameraType.back ? CameraType.front : CameraType.back,
        );
    }

    const toggleCamera = () => {
        setCameraOn(prevState => !prevState);
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

    const FaceBox = ({faceLoc, apiFaceLoc, apiFaceNames}) => {
        if (!faceLoc) {
            return null;
        }
        return faceLoc.map((face, index) => {
            try {
                const top = face.bounds.origin.y - 10;
                const left = face.bounds.origin.x - 5;
                const height = face.bounds.size.height;
                const width = face.bounds.size.width;
                const fontSize = Math.min(height, width) / 9;
                const text_bottom = top + height + 10;
                const text_right = left + width + 10;
                const styles = StyleSheet.create({
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
                        bottom: text_bottom,
                        right: text_right,
                        color: 'red',
                        padding: 5,
                        borderRadius: 5,
                        fontSize: fontSize,
                    },
                });

                function getSimilarFaceIndex() {
                    for (let i = 0; i < apiFaceLoc.length; i++) {
                        if (
                            Math.abs(capturedBounds[i].bounds.origin.y - apiFaceLoc[i].top) <= 50 &&
                            Math.abs(capturedBounds[i].bounds.origin.x - apiFaceLoc[i].left) <= 50
                        ) {
                            return i;
                        }
                    }
                    return -1;
                }

                let personName = 'Unknown';
                if (!apiFaceLoc) {
                    personName = 'API Loading...';
                } else {
                    const similarFaceIndex = getSimilarFaceIndex();
                    if (similarFaceIndex !== -1) {
                        personName = apiFaceNames[similarFaceIndex];
                    } else {
                        console.log('Similar face not found');
                    }
                }
                console.log('personName', personName);
                return (
                    <View key={index} style={styles.faceBox}>
                        <Text style={styles.nameText}>{personName}</Text>
                    </View>
                );
            } catch (e) {
                return (
                    <View>
                        <Text>Error in FaceBox</Text>
                    </View>
                );
            }
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.toggleContainer}>
                <TouchableOpacity style={styles.toggleButton} onPress={toggleCamera}>
                    <Text style={styles.toggleText}>
                        {cameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
                    </Text>
                </TouchableOpacity>
            </View>
            {pictureUploading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff"/>
                    <Text>Uploading image...</Text>
                </View>
            )}
            {cameraOn ? (
                <Camera
                    style={styles.camera}
                    type={type}
                    ref={handleCameraReady}
                    onCameraReady={requestPermission}
                    onFacesDetected={({faces}) =>
                        handleFacesDetected({faces, camera: cameraRef})
                    }
                    onFaceDetectionError={handleFaceDetectionError}
                    faceDetectorSettings={{
                        mode: FaceDetector.FaceDetectorMode.fast,
                        detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
                        runClassifications: FaceDetector.FaceDetectorClassifications.all,
                        minDetectionInterval: 1000,
                        tracking: true,
                    }}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
                            <Text style={styles.text}>Flip Camera</Text>
                        </TouchableOpacity>
                    </View>
                    {faceLoc && (
                        <FaceBox faceLoc={faceLoc} apiFaceLoc={apiFaceLoc} apiFaceNames={apiFaceNames}/>
                    )}
                    <CaptureButton/>
                </Camera>
            ) : (
                <Text>Camera is off</Text>
            )}
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
    },
});
export default FaceRecognitionExample;
