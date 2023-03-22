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
    ActivityIndicator,
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

const FaceRecognitionExample = () => {
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [cameraRef, setCameraRef] = useState(null);
    const [person, setPerson] = useState(null);
    const [personIsSet, setPersonIsSet] = useState(false);
    const [cameraOn, setCameraOn] = useState(true);
    const [pictureUploading, setPictureUploading] = useState(false);
    const [faceLoc, setFaceLoc] = useState(null);
    const [capturePressed, setCapturePressed] = useState(false);
    // Turn on the camera when the component mounts

    // Set the cameraRef state variable when the camera is ready
    const handleCameraReady = ref => {
        setCameraRef(ref);
    };

    // const debouncedRecognizeFace = useCallback(
    //   debounce(recognizeFace, 3000, {leading: true, trailing: false}),
    //   [],
    // );

    // Handle face detection events
    const handleFacesDetected = async ({faces, camera}) => {
        if (faces.length > 0) {
            const faceLocations = [];
            faceLocations.push(faces[0].bounds.origin.x);
            faceLocations.push(faces[0].bounds.origin.y);
            faceLocations.push(faces[0].bounds.size.width);
            faceLocations.push(faces[0].bounds.size.height);
            setFaceLoc(faceLocations);
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
        const localUri = imageUri;
        setPictureUploading(true);
        setPerson('Loading...');
        const manipulatedImage = await manipulateAsync(
            localUri,
            [{resize: {width: 400, height: 500}}],
            {
                compress: 1,
                format: ImageManipulator.SaveFormat.JPEG,
            },
        );

        const response = await fetch(manipulatedImage.uri);
        const blob = await response.blob();
        const userId = auth.currentUser.uid;
        const path = `images/ml_images/${userId}.jpg`;
        const storageRef = storage.ref(path);
        console.log('uploading image');
        const uploadTask = uploadBytesResumable(storageRef, blob);
        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
            'state_changed',
            snapshot => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            error => {
                this.setState({isLoading: false});
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case 'storage/unauthorized':
                        console.log("User doesn't have permission to access the object");
                        break;
                    case 'storage/canceled':
                        console.log('User canceled the upload');
                        break;
                    case 'storage/unknown':
                        console.log('Unknown error occurred, inspect error.serverResponse');
                        break;
                }
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                console.log('Upload completed');

                //perform your task
            },
        );
        // const formData = new FormData();
        const jsonData = JSON.stringify({path: path, user_id: userId});
        // formData.append('path', path);
        try {
            const response = await fetch(
                'http://192.168.4.36:8000/api/facial_recognition',
                {
                    method: 'POST',
                    body: jsonData,
                },
            );
            const data = await response.json();
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
            const str = data.predicted_person[0];
            if (str === 'Unknown') {
                setPictureUploading(false);
                setPerson(str);
            } else {
                console.log('Name is: ', str);
                const name = str.split('_').join(' ').split('.')[0];
                setPerson(name);
                const userByNameId = await getUserByName(name);
                console.log('userByNameId', userByNameId);
                if (userByNameId) {
                    console.log('Updating Interests');
                    await updateRecents(userByNameId.uid);
                }
            }
            setPersonIsSet(true);
            setPictureUploading(false);
            return data.predicted_person[0];
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

    const FaceBox = ({faceLoc}) => {
        if (!faceLoc) {
            return null;
        }
        const top = faceLoc[0] + 25;
        const left = faceLoc[1] - 75;
        const height = faceLoc[2];
        const width = faceLoc[3];
        try {
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
                    bottom: -30,
                    right: -20,
                    color: 'red',
                    padding: 5,
                    borderRadius: 5,
                    fontSize: 20,
                },
            });

            return (
                <View style={styles.faceBox}>
                    {personIsSet && <Text style={styles.nameText}>{person}</Text>}
                </View>
            );
        } catch (e) {
            console.log('Error in FaceBox', e);
        }
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
                        runClassifications: FaceDetector.FaceDetectorClassifications.none,
                        minDetectionInterval: 1000,
                        tracking: true,
                    }}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
                            <Text style={styles.text}>Flip Camera</Text>
                        </TouchableOpacity>
                    </View>
                    <CaptureButton/>
                    {faceLoc && <FaceBox faceLoc={faceLoc}/>}
                </Camera>
            ) : (
                <Text>Camera is off</Text>
            )}
            <View style={styles.personContainer}>
                {personIsSet && <Text style={styles.personText}>Person: {person}</Text>}
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
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderWidth: 8,
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
