import React, {useState} from 'react';
import {Text, View, StyleSheet, ScrollView, Alert, Button} from 'react-native';
import RectangleComponent from '../components/RectangleComponent';
import FormInputComponent from '../components/FormInputComponent';
import ImagePickerComponent from '../components/ImagePickerComponent';
import TextButtonComponent from '../components/TextButtonComponent';
import dimensions from '../config/DeviceSpecifications';
import {
  setImageForUser,
  updateUserName,
} from '../config/DB_Functions/DB_Functions';
import {auth, storage} from '../config/firebaseConfig';
import * as Progress from 'react-native-progress';

function InitialInfoScreen({navigation}) {
  const [uploaded, setUploaded] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [image, setImage] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imageSet, setImageSet] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [uploadPhoto, setUploadPhoto] = useState(false);

  async function updateNameAndImage() {
    const user = auth.currentUser;
    console.log('photo', photoUrl);
    let name = firstName + ' ' + lastName;
    await updateUserName(user, name).then(r => {
      console.log('r', r);
    });
    // .8 second delay to allow firebase to update
    setTimeout(() => {
      navigation.navigate('Interests');
    }, 800);
  }

  const handleSetImage = uri => {
    setImage(uri);
    setUploadPhoto(true);
  };

  const uploadImage = async () => {
    setUploadPhoto(false);
    const {uri} = image;
    const userId = auth.currentUser.uid;
    const user = auth.currentUser;
    const timestamp = new Date().getTime();
    const path = `images/Avatar/${userId}-${timestamp}.jpg`;

    setUploading(true);
    console.log('Hereee', uri);
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
        console.log('url', url);
        await setImageForUser(user, url, 'Avatar');
        setImage(null);
        Alert.alert(
          'Photo uploaded!',
          'Your photo has been uploaded to Firebase Cloud Storage!',
        );
        setUploading(false);
      },
    );
    setUploaded(true);
  };

  return (
    <View style={styles.container}>
      <RectangleComponent />
      <Text style={styles.text}>
        Please fill out the following information{'\n'}
      </Text>
      <Text style={styles.textLabel}>First Name</Text>

      <FormInputComponent placeholderText={'John'} changeText={setFirstName} />
      <Text style={styles.textLabel}>Last Name</Text>
      <FormInputComponent placeholderText={'Doe'} changeText={setLastName} />

      <Text>{'\n'}</Text>
      <Text>{'\n'}</Text>
      <ImagePickerComponent
        setImageSet={setImageSet}
        setPhoto={handleSetImage}
      />
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
      {uploaded ? (
        <View style={styles.next}>
          <TextButtonComponent
            text="Next"
            onPress={() => updateNameAndImage()}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  text: {
    fontSize: 15,
    padding: 10,
    fontWeight: 'bold',
    color: '#070707',
  },
  textLabel: {
    right: dimensions.width * 0.35,
  },
  next: {
    marginLeft: dimensions.width * 0.7,
    marginTop: dimensions.height * 0.05,
  },
});
export default InitialInfoScreen;
