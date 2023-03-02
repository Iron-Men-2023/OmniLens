import React, {useState, useEffect} from 'react';
import firebase from 'firebase/app';
import * as FileSystem from 'expo-file-system';
import * as FaceDetector from 'expo-face-detector';
import {Camera, CameraType} from 'expo-camera';
import {storage, auth, db} from '../../config/firebaseConfig';
import {TouchableOpacity, View, StyleSheet, Text, Alert} from 'react-native';
import {setImageForUser} from '../../config/DB_Functions/DB_Functions';

const FaceRecognitionExample = () => {
  const [model, setModel] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);
  const [person, setPerson] = useState(null);
  const [personIsSet, setPersonIsSet] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [pictureUploading, setPictureUploading] = useState(false);
  // Turn on the camera when the component mounts

  const turnOffCamera = async () => {
    console.log('Turning off camera');

    setCameraOn(false);
    console.log('Camera is off');
    cameraRef.stopRecording();
    console.log('Camera recording is stopped');
    cameraRef.pausePreview();
    console.log('Camera preview is paused');
  };
  // Set the cameraRef state variable when the camera is ready
  const handleCameraReady = ref => {
    setCameraRef(ref);
  };

  // Handle face detection events
  const handleFacesDetected = async ({faces, camera}) => {
    console.log('Faces detected:', faces);
    try {
      async function recognizeFace(imageUri) {
        console.log('imageUri', imageUri);
        const localUri = imageUri;
        setPictureUploading(true);
        const response = await fetch(localUri);
        const blob = await response.blob();
        const userId = auth.currentUser.uid;
        const path = `images/ml_images/${userId}.jpg`;
        const task = storage.ref(path).put(blob);
        task.on(
          'state_changed',
          snapshot => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          error => {
            console.log(error);
            Alert.alert('An error occurred while uploading the photo.');
          },
          async () => {
            console.log('Upload complete');
            const uri = await storage.ref(path).getDownloadURL();
            const formData = new FormData();
            formData.append('path', path);
            console.log('formData', formData);
            try {
              const response = await fetch(
                'http://192.168.0.203:8000/api/facial-recognition',
                {
                  method: 'POST',
                  body: formData,
                },
              );
              const data = await response.json();
              console.log('data', data);
              if (data.message === 'No face found') {
                console.log('No face found');
                return 'No face found';
              }
              console.log('data.predicted_person', data.predicted_person);
              setPerson(data.predicted_person[0]);
              setPersonIsSet(true);
              setPictureUploading(false);
              return data.predicted_person[0];
            } catch (e) {
              console.log('No person found OR Need to start server', e);
            }
            return 'No person found OR Need to start server';
          },
        );
      }

      if (faces.length > 0) {
        if (pictureUploading) {
          console.log('Picture is uploading');
          return;
        }
        const photo = await camera.takePictureAsync();
        console.log('Photo taken:');
        cameraRef.pausePreview();
        recognizeFace(photo.uri).then(r => console.log(r));
        cameraRef.resumePreview();
      } else {
        console.log('No faces detected');
      }
    } catch (e) {
      console.log('Error', e);
    }
  };

  // Handle face detection errors
  const handleFaceDetectionError = error => {
    requestPermission().then(r => console.log(r));
    console.error('Error detecting faces:', error);
  };

  function toggleCameraType() {
    if (pictureUploading) {
      console.log('Picture is uploading');
      return;
    }
    setType(current =>
      current === CameraType.back ? CameraType.front : CameraType.back,
    );
  }

  const toggleCamera = () => {
    setCameraOn(prevState => !prevState);
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
          quality={1} // adjust quality
          faceDetectorSettings={{
            mode: FaceDetector.FaceDetectorMode.accurate,
            detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
            runClassifications: FaceDetector.FaceDetectorClassifications.all,
            minDetectionInterval: 5000,
            tracking: true,
          }}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
          </View>
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
  },
  toggleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  personContainer: {
    flex: 0.1,
  },
  personText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
});
export default FaceRecognitionExample;
