import React, {useState} from 'react';
import {Text, View, StyleSheet, ScrollView, Alert, Button} from 'react-native';
import RectangleComponent from '../components/RectangleComponent';
import FormInputComponent from '../components/FormInputComponent';
import ImagePickerComponent from '../components/ImagePickerComponent';
import TextButtonComponent from '../components/TextButtonComponent';
import dimensions from '../config/DeviceSpecifications';
import {
    fetchApiData,
    setImageForUser,
    updateUserName, uriToBase64,
} from '../config/DB_Functions/DB_Functions';
import {auth, storage} from '../config/firebaseConfig';
import * as Progress from 'react-native-progress';
import {manipulateAsync} from 'expo-image-manipulator';
import * as ImageManipulator from 'expo-image-manipulator';
import {uploadBytesResumable} from 'firebase/storage';
import {apiUrl} from '../config';

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
    const [checkingPhoto, setCheckingPhoto] = useState(false);

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
        const path = `images/Avatar/${userId}.jpg`;

        setUploading(true);
        console.log('Hereee', uri);
        const manipulatedImage = await manipulateAsync(
            uri,
            [{resize: {width: 400}}],
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
                await setImageForUser(user, url, 'Avatar');
                Alert.alert(
                    'Photo uploaded!',
                    'Your photo has been uploaded to Firebase Cloud Storage!',
                );
                setUploading(false);

                //perform your task
            },
        );
        const base64Image = await uriToBase64(uri);
        // Try sending as form data
        const formData = new FormData();
        formData.append('image', base64Image);
        formData.append('user_id', auth.currentUser.uid);
        formData.append('device_sent_from', 'app');
        // console.log('form data: ', formData);
        setCheckingPhoto(true);
        try {
            const apiData = await fetchApiData(formData, '/api/facial_recognition/check');

            if (apiData) {
                console.log('Data for photo: ', apiData);
                if (
                    apiData.message === 'No face found') {
                    Alert.alert(
                        'No face found',
                        'Please upload a better image with a single picture of your face',
                    );
                } else if (apiData.message === 'Face found') {
                    Alert.alert(
                        'Face found',
                        'Your face has been found in the image!',
                    );
                    setUploaded(true);
                }
            } else {
                Alert.alert(
                    'Error',
                    'There was an error processing your image. Please try again',
                );
            }
        } catch (e) {
            console.log('Error: ', e);
        }
        setCheckingPhoto(false);
    };

    return (
        <View style={styles.container}>
            <RectangleComponent/>
            <Text style={styles.text}>
                Please fill out the following information{'\n'}
            </Text>
            <Text style={styles.textLabel}>First Name</Text>

            <FormInputComponent placeholderText={'John'} changeText={setFirstName}/>
            <Text style={styles.textLabel}>Last Name</Text>
            <FormInputComponent placeholderText={'Doe'} changeText={setLastName}/>

            <Text>{'\n'}</Text>
            <ImagePickerComponent
                setImageSet={setImageSet}
                setPhoto={handleSetImage}
            />
            {uploadPhoto && (
                <View style={styles.uploadButtonContainer}>
                    <View style={styles.uploadButtonWrapper}>
                        <Button title="Upload Photo" onPress={uploadImage}/>
                    </View>
                </View>
            )}
            {uploading && (
                <View style={styles.progressBarContainer}>
                    <Progress.Bar progress={transferred} width={300}/>
                </View>
            )}
            {checkingPhoto && (
                <View style={styles.progressBarContainer}>
                    <Progress.Circle/>
                    <Text>Checking Photo...</Text>
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
