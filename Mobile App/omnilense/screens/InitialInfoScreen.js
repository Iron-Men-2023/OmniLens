import React, {useState} from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import RectangleComponent from '../components/RectangleComponent';
import FormInputComponent from '../components/FormInputComponent';
import ImagePickerComponent from '../components/ImagePickerComponent';
import TextButtonComponent from '../components/TextButtonComponent';
import dimensions from '../config/DeviceSpecifications';
import {updateUser} from '../src/DB_Functions/DB_Functions';
import {auth, storage} from '../config/firebaseConfig';

function InitialInfoScreen({navigation}) {
  const [uploaded, setUploaded] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [image, setImage] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imageSet, setImageSet] = useState(false);

  async function updateNameAndImage() {
    const user = auth.currentUser;
    console.log('photo', photoUrl);
    let name = firstName + ' ' + lastName;
    await updateUser(user, name, photoUrl).then(r => {
      console.log('r', r);
    });
    navigation.navigate('Interests');
  }

  const handleSetImage = uri => {
    console.log('uri', uri);
    setImage(uri);
  };

  const uploadImage = async () => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', image, true);
      xhr.send(null);
    });
    const ref = storage.ref().child(`Pictures/Image1`);
    const snapshot = ref.put(blob);
    setUploading(true);
    snapshot.on(
      'state_changed',
      () => {
        setUploading(true);
      },
      error => {
        setUploading(false);
        console.log(error);
        blob.close();
        return;
      },
      () => {
        snapshot.snapshot.ref.getDownloadURL().then(url => {
          setUploading(false);
          console.log('Download URL: ', url);
          setImage(url);
          blob.close();
          setPhotoUrl(url);
          setUploaded(true);
          return url;
        });
      },
    );
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
      <FormInputComponent placeholderText={'Doe'} changeText={setFirstName} />

      <Text>{'\n'}</Text>
      <Text>{'\n'}</Text>
      <ImagePickerComponent
        setImageSet={setImageSet}
        setPhoto={handleSetImage}
      />
      {imageSet ? (
        <View>
          {uploading ? (
            <Text>Uploading...</Text>
          ) : (
            <TextButtonComponent text="Upload" onPress={() => uploadImage()} />
          )}
        </View>
      ) : null}
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
