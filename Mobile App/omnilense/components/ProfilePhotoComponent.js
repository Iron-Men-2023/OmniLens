import * as ImagePicker from 'expo-image-picker';
import {auth, storage} from '../config/firebaseConfig';
import {
  Alert,
  Platform,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  View,
  Button,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Logo from '../assets/Logo.png';
import {
  fetchUserData,
  setImageForUser,
} from '../config/DB_Functions/DB_Functions';
import * as Progress from 'react-native-progress';
import {manipulateAsync} from 'expo-image-manipulator';
import * as ImageManipulator from 'expo-image-manipulator';
import {uploadBytesResumable} from 'firebase/storage';

const ProfilePhoto = ({imageStyle, photoType, user, viewOnly}) => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [uploadPhoto, setUploadPhoto] = useState(false);
  const [userImageUrl, setUserImageUrl] = useState(() => {
    if (photoType === 'Avatar') {
      console.log('user.avatarPhotoUrl', user.avatarPhotoUrl);
      return user.avatarPhotoUrl;
    } else if (photoType === 'Cover') {
      console.log('user.coverPhotoUrl', user.coverPhotoUrl);
      return user.coverPhotoUrl;
    }
  });

  const handleChoosePhoto = async () => {
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      resize: {width: 500, height: 500},
      base64: true, // optionally, if you want to get the base64-encoded string of the image
    };
    ImagePicker.launchImageLibraryAsync(options)
      .then(response => {
        if (response.canceled) {
        } else {
          const source = {uri: response.assets[0].uri};
          setImage(source);
          setUploadPhoto(true);
        }
      })
      .catch(e => console.log(e));
  };

  const uploadImage = async () => {
    console.log('Photo Type', photoType);
    setUploadPhoto(false);
    const {uri} = image;
    const userId = auth.currentUser.uid;
    const user = auth.currentUser;
    const path = `images/${photoType}/${userId}.jpg`;

    setUploading(true);
    const manipulatedImage = await manipulateAsync(
      uri,
      [{resize: {width: 400, height: 500}}],
      {
        compress: 1,
        format: ImageManipulator.SaveFormat.JPEG,
      },
    );

    const response = await fetch(manipulatedImage.uri);
    const blob = await response.blob();

    const storageRef = storage.ref(path);
    setTransferred(0);
    const uploadTask = uploadBytesResumable(storageRef, blob);
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      'state_changed',
      snapshot => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setTransferred(progress / 100);
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
      async () => {
        // Upload completed successfully, now we can get the download URL
        const url = await storageRef.getDownloadURL();
        console.log('url', url);
        console.log('user is being set');
        await setImageForUser(user, url, photoType);
        console.log('user is set');
        setImage(null);
        setUserImageUrl(url);
        Alert.alert(
          'Photo uploaded!',
          'Your photo has been uploaded to Firebase Cloud Storage!',
        );
        setUploading(false);

        //perform your task
      },
    );
  };

  return (
    <>
      {userImageUrl ? (
        <TouchableOpacity onPress={!viewOnly ? handleChoosePhoto : null}>
          <Image source={{uri: userImageUrl}} style={imageStyle} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={handleChoosePhoto}>
          <Image source={Logo} style={imageStyle} resizeMode="contain" />
          <Text style={{color: 'white'}}>Choose Photo</Text>
        </TouchableOpacity>
      )}
      {uploadPhoto && (
        <View style={styles.uploadButtonContainer}>
          <View style={styles.uploadButtonWrapper}>
            <Button title="Upload Photo" onPress={uploadImage} />
          </View>
        </View>
      )}
      {uploading && (
        <View style={styles.progressBarContainer}>
          <Progress.Bar progress={transferred} width={300} />
        </View>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 10,
  },
  uploadButtonContainer: {
    position: 'absolute',
    top: 300,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButtonWrapper: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    position: 'relative',
  },
  progressBarContainer: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
    position: 'absolute',
    top: 365,
  },
});

export default ProfilePhoto;
