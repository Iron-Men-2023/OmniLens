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
import {manipulateAsync} from 'expo-image-manipulator';
import * as ImageManipulator from 'expo-image-manipulator';
import {uploadBytesResumable} from 'firebase/storage';
import {apiUrl} from "../../config";

const MLScreen = () => {
    const [type, setType] = useState(CameraType.back);
    const [cameraRef, setCameraRef] = useState(null);
    const [faceLocations, setFaceLocations] = useState([]);
    const [capturePressed, setCapturePressed] = useState(false);
    const [apiFaceLocations, setApiFaceLocations] = useState([]);
    const [apiFaceNames, setApiFaceNames] = useState([]);
    const [pictureUploading, setPictureUploading] = useState(false);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [uploadingComplete, setUploadingComplete] = useState(false);

    // async function recognizeFace(imageUri, num_of_faces) {
    //     const localUri = imageUri;
    //     const manipulatedImage = await manipulateAsync(
    //         localUri,
    //         [{resize: {width: 400}}],
    //         {
    //             compress: 1,
    //             format: ImageManipulator.SaveFormat.JPEG,
    //         },
    //     );
    //
    //     // Upload image and process API data
    //     const uploadTask = await uploadImage(manipulatedImage.uri);
    //     console.log('uploadTask result', uploadTask);
    //     if (uploadTask) {
    //         console.log('Api data is being processed');
    //         const jsonData = JSON.stringify({
    //             path: uploadTask.path,
    //             user_id: uploadTask.userId,
    //             num_of_faces: num_of_faces
    //         });
    //         const apiData = await fetchApiData(jsonData);
    //         processApiData(apiData);
    //     } else {
    //         setPictureUploading(false);
    //     }
    // }
    //
    // async function uploadImage(uri) {
    //     const response = await fetch(uri);
    //     const blob = await response.blob();
    //     const userId = auth.currentUser.uid;
    //     const path = `images/ml_images/${userId}.jpg`;
    //     const storageRef = storage.ref(path);
    //     // console.log('uploading image');
    //     const uploadTask = uploadBytesResumable(storageRef, blob);
    //     // Listen for state changes, errors, and completion of the upload.
    //     uploadTask.on(
    //         'state_changed',
    //         snapshot => {
    //             // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    //             const progress =
    //                 (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //             console.log('Upload is ' + progress + '% done');
    //             switch (snapshot.state) {
    //                 case 'paused':
    //                     break;
    //                 case 'running':
    //                     break;
    //             }
    //         },
    //         error => {
    //             this.setState({isLoading: false});
    //             switch (error.code) {
    //                 case 'storage/unauthorized':
    //                     console.log("User doesn't have permission to access the object");
    //                     break;
    //                 case 'storage/canceled':
    //                     console.log('User canceled the upload');
    //                     break;
    //                 case 'storage/unknown':
    //                     console.log('Unknown error occurred, inspect error.serverResponse');
    //                     break;
    //             }
    //         },
    //         () => {
    //             console.log('Upload completed');
    //             setUploadingComplete(true);
    //         },
    //     );
    //     console.log('completed', uploadingComplete);
    //     if (!uploadingComplete) {
    //         return null;
    //     } else {
    //         setUploadingComplete(false);
    //         return {path, userId};
    //     }
    // }
    //
    // async function fetchApiData(jsonData) {
    //     // Implement the API data fetching logic here
    //     console.log('json data: ', jsonData);
    //     try {
    //         const response = await fetch(
    //             `${apiUrl}/api/facial_recognition`,
    //             {
    //                 method: 'POST',
    //                 body: jsonData,
    //             },
    //         );
    //         // Return the data on success, or null on failure
    //         return response.ok ? await response.json() : null;
    //     } catch (e) {
    //         console.log(e);
    //         return null;
    //     }
    // }
    async function recognizeFace(imageUri, num_of_faces) {
        const base64Image = await uriToBase64(imageUri);
        const jsonData = JSON.stringify({
            image: base64Image,
            user_id: auth.currentUser.uid,
            num_of_faces: num_of_faces,
            device_sent_from: "app"
        });
        const apiData = await fetchApiData(jsonData);
        processApiData(apiData);
    }

    async function uriToBase64(uri) {
        const response = await fetch(uri);
        const blob = await response.blob();
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onerror = () => {
                reader.abort();
                reject(new Error('Problem parsing input file.'));
            };
            reader.onload = () => {
                resolve(reader.result.split(',')[1]);
            };
            reader.readAsDataURL(blob);
        });
    }

    async function fetchApiData(jsonData) {
        // console.log('json data: ', jsonData);
        try {
            const response = await fetch(`${apiUrl}/api/facial_recognition`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: jsonData,
            });
            return response.ok ? await response.json() : null;
        } catch (e) {
            console.log(e);
            return null;
        }
    }


    function processApiData(data) {
        console.log('data', data);
        if (!data || data.message === 'No face found' || !data.predicted_person || data.message === 'Error') {
            console.log(data?.message);
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

        console.log('Hereeeeee', faceLocations);

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

    const FaceBox = ({face, apiFace, apiFaceName}) => {
        if (!face) {
            return null;
        }

        const top = face.bounds.origin.y - 10;
        const left = face.bounds.origin.x - 5;
        const height = face.bounds.size.height;
        const width = face.bounds.size.width;
        const fontSize = Math.min(height, width) / 9;
        const textBottom = top + height + 10;
        const textRight = left + width + 10;

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
                bottom: -35,
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
                <Text style={boxStyles.nameText}>{personName}</Text>
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
