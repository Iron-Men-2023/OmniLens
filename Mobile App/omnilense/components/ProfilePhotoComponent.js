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
import Logo from '../assets/logo.png';
import {
  fetchUserData,
  setImageForUser,
} from '../config/DB_Functions/DB_Functions';
import * as Progress from 'react-native-progress';
import {Asset} from 'expo-asset';

const ProfilePhoto = ({imageStyle, photoType, user}) => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [uploadPhoto, setUploadPhoto] = useState(false);
  const [userImageUrl, setUserImageUrl] = useState(() => {
    if (photoType === 'Avatar') {
      return user.avatarPhotoUrl;
    } else if (photoType === 'Cover') {
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
        console.log('response', response);
        if (response.canceled) {
          console.log('User cancelled image picker');
        } else {
          const source = {uri: response.assets[0].uri};
          console.log('Source is', source);
          setImage(source);
          setUploadPhoto(true);
        }
      })
      .catch(e => console.log(e));
  };

  const uploadImage = async () => {
    setUploadPhoto(false);
    const {uri} = image;
    const userId = auth.currentUser.uid;
    const user = auth.currentUser;
    const timestamp = new Date().getTime();
    const path = `images/${photoType}/${userId}-${timestamp}.jpg`;

    setUploading(true);
    const response = await fetch(uri);
    const blob = await response.blob();

    const task = storage.ref(path).put(blob);
    setTransferred(0);
    task.on(
      'state_changed',
      snapshot => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
        setTransferred(progress / 100);
      },
      error => {
        console.log(error);
        Alert.alert('An error occurred while uploading the photo.');
      },
      async () => {
        const url = await task.snapshot.ref.getDownloadURL();
        setUserImageUrl(url);
        await setImageForUser(user, url, photoType);
        setImage(null);
        Alert.alert(
          'Photo uploaded!',
          'Your photo has been uploaded to Firebase Cloud Storage!',
        );
        setUploading(false);
      },
    );
  };

  return (
    <>
      {userImageUrl ? (
        <TouchableOpacity onPress={handleChoosePhoto}>
          <Image
            source={{uri: userImageUrl}}
            style={imageStyle}
            resizeMode="fill"
          />
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
