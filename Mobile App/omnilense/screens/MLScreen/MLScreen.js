import React, {useState, useEffect} from 'react';
import firebase from 'firebase/app';
import * as FileSystem from 'expo-file-system';
import * as FaceDetector from 'expo-face-detector';
import {Camera, CameraType} from 'expo-camera';
import {storage, auth, db} from '../../config/firebaseConfig';
import {TouchableOpacity, View, StyleSheet, Text} from 'react-native';

const FaceRecognitionExample = () => {
  const [model, setModel] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);
  const [person, setPerson] = useState(null);
  const [personIsSet, setPersonIsSet] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  // Turn on the camera when the component mounts
  useEffect(() => {
    setCameraOn(true);
  }, []);

  useEffect(() => {
    return () => {
      console.log('Unmounting');
      turnOffCamera().then(r => console.log(r));
    };
  }, []);

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

    async function recognizeFace(image) {
      // console.log('image', image);
      const formData = new FormData();
      formData.append('image', image);
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
        console.log('data.predicted_person', data.predicted_person);
        setPerson(data.predicted_person);
        setPersonIsSet(true);
        return data.predicted_person;
      } catch (e) {
        console.log('No person found OR Need to start server', e);
      }
      return 'No person found OR Need to start server';
    }

    if (faces.length > 0) {
      const photo = await camera.takePictureAsync({base64: true});
      console.log('Photo taken:');
      recognizeFace(photo.base64).then(r => console.log(r));
    } else {
      console.log('No faces detected');
    }
  };
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

  return (
    <View style={styles.container}>
      {cameraOn ? (
        <Camera
          style={styles.camera}
          type={type}
          ref={handleCameraReady}
          onCameraReady={requestPermission}
          onMountError={handleFaceDetectionError}
          onFacesDetected={({faces}) =>
            handleFacesDetected({faces, camera: cameraRef})
          }
          onFaceDetectionError={handleFaceDetectionError}
          faceDetectorSettings={{
            mode: FaceDetector.FaceDetectorMode.fast,
            detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
            runClassifications: FaceDetector.FaceDetectorClassifications.none,
            minDetectionInterval: 3000,
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
      <View>{personIsSet && <Text>Person: {person}</Text>}</View>
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
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});
export default FaceRecognitionExample;
