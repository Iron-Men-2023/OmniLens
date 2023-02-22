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

const ProfilePhoto = ({imageStyle, photoType}) => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [user, setUser] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [uploadPhoto, setUploadPhoto] = useState(false);
  const [userImageUrl, setUserImageUrl] = useState(null);

  console.log(imageStyle);

  const handleChoosePhoto = async async => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      console.log('image', image);
      setUploadPhoto(true);
    }
  };

  const uploadImage = async () => {
    setUploadPhoto(false);
    const uri = image;
    console.log('uri', uri);
    console.log('image', image);
    const userId = auth.currentUser.uid;
    const user = auth.currentUser;
    const timestamp = new Date().getTime();
    const path = `images/${photoType}/${userId}-${timestamp}.jpg`;
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

    setUploading(true);
    setTransferred(0);

    const task = storage.ref(path).put(uploadUri);

    try {
      await task;
      const url = await storage.ref(path).getDownloadURL();
      setUserImageUrl(url);
      await setImageForUser(user, url, photoType);
      setImage(null);
      Alert.alert(
        'Photo uploaded!',
        'Your photo has been uploaded to Firebase Cloud Storage!',
      );
    } catch (error) {
      console.log(error);
      Alert.alert('An error occurred while uploading the photo.');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchUserData()
      .then(r => {
        console.log('user data: ', r);
        setUser(r.userDoc);
        console.log('user photo: ', r.userDoc.photoURL);
        if (r.userDoc.photoURL) {
          setUserImage(true);
          setUserImageUrl(r.userDoc.photoURL);
          console.log('Photo Set');
        }
      })
      .catch(e => console.log('e1', e));
  }, [userImage]);

  return (
    <TouchableOpacity onPress={handleChoosePhoto}>
      <Image source={Logo} style={imageStyle} resizeMode="contain" />
    </TouchableOpacity>
    // <View>
    //   {userImage ? (
    //     <TouchableOpacity onPress={handleChoosePhoto}>
    //       <Image
    //         source={{uri: userImageUrl}}
    //         style={imageStyle}
    //         resizeMode="contain"
    //       />
    //     </TouchableOpacity>
    //   ) : (
    //     <TouchableOpacity onPress={handleChoosePhoto}>
    //       <Image source={Logo} style={imageStyle} resizeMode="contain" />
    //     </TouchableOpacity>
    //   )}
    //   {uploadPhoto ? (
    //     <View>
    //       <Button title={'Upload Photo'} onPress={uploadImage} />
    //     </View>
    //   ) : null}
    //   {uploading ? (
    //     <View>
    //       <Progress.Bar progress={transferred} width={300} />
    //     </View>
    //   ) : null}
    // </View>
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
