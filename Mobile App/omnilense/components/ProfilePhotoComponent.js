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

const ProfilePhoto = ({imageStyle, photoType}) => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [user, setUser] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [uploadPhoto, setUploadPhoto] = useState(false);
  const [userImageUrl, setUserImageUrl] = useState(null);

  console.log(imageStyle);

  const handleChoosePhoto = async () => {
    const options = {
      aspect: [4, 3],
      quality: 0.8,
      format: 'jpeg',
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
        setTransferred(progress);
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

  useEffect(() => {
    fetchUserData()
      .then(r => {
        try {
          console.log('\n\n\n\nR fetch is', r);
          setUser(r.userDoc);
          console.log('user', user);
          if (r.userDoc.avatarPhotoUrl || r.userDoc.coverPhotoUrl) {
            console.log('photoType', photoType);
            if (photoType === 'Avatar') {
              setUserImageUrl(user.avatarPhotoUrl);
            }
            if (photoType === 'Cover') {
              setUserImageUrl(user.coverPhotoUrl);
            }
            console.log('\n\n\n\n\nuserImageUrl', userImageUrl);
            setUserImage(true);
          }
        } catch (e) {
          console.log('e42', e);
        }
      })
      .catch(e => console.log('e5', e));
  }, [userImage]);

  return (
    <>
      {userImage && userImageUrl ? (
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
        </TouchableOpacity>
      )}
      {uploadPhoto ? (
        <View>
          <Button title={'Upload Photo'} onPress={uploadImage} />
        </View>
      ) : null}
      {uploading ? (
        <View>
          <Progress.Bar progress={transferred} width={300} />
        </View>
      ) : null}
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
});

export default ProfilePhoto;
