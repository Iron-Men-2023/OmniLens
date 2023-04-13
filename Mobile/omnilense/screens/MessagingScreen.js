// Import required dependencies and add them to the top of your file
import {
  Bubble,
  GiftedChat,
  InputToolbar,
  MessageImage,
  Send,
} from 'react-native-gifted-chat';
import {MaterialIcons} from '@expo/vector-icons';
import React, {useEffect, useState} from 'react';
import {auth, db, storage} from '../config/firebaseConfig';
import {
  Alert,
  ImageBackground,
  StyleSheet,
  Platform,
  TouchableOpacity,
  View,
  Image,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import firebase from 'firebase/compat/app';
import {
  getUserById,
  setImageForUser,
} from '../config/DB_Functions/DB_Functions';
import {Button, useTheme, Avatar, Text} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import {Camera, CameraType} from 'expo-camera';
import {manipulateAsync} from 'expo-image-manipulator';
import * as ImageManipulator from 'expo-image-manipulator';
import {uploadBytesResumable} from 'firebase/storage';
import Backdrop from 'react-native-backdrop/example/Backdrop'; //
import {BlurView} from 'expo-blur';

// Create ChatScreen component
const MessagingScreen = ({navigation, route}) => {
  const {id, chatName, recipientId} = route.params;
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [recipient, setRecipient] = useState(null);
  const {colors} = useTheme();
  const [type, setType] = useState(CameraType.back);
  const [cameraRef, setCameraRef] = useState(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [capturePressed, setCapturePressed] = useState(false);
  const [image, setImage] = useState(null);
  const [uploadPhoto, setUploadPhoto] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUserData = await db
        .collection('users')
        .doc(auth.currentUser.uid)
        .get()
        .then(doc => doc.data());
      console.log('Current User: ', currentUserData);
      setCurrentUser(currentUserData);

      const recipientData = await db
        .collection('users')
        .doc(recipientId)
        .get()
        .then(doc => doc.data());
      console.log('Recipient: ', recipientData);
      setRecipient(recipientData);
    };

    fetchUserData().then(r => console.log('User data fetched'));
  }, []);

  useEffect(() => {
    return db
      .collection('chats')
      .doc(id)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        setMessages(
          snapshot.docs.map(doc => ({
            _id: doc.data()._id ? doc.data()._id : doc.id,
            createdAt: doc.data().createdAt
              ? doc.data().createdAt.toDate()
              : new Date(),
            text: doc.data().text,
            user: doc.data().user,
            received: doc.data().received,
          })),
        );
      });
  }, [route]);

  const onSend = async (newMessages = []) => {
    const message = newMessages[0];
    console.log(message);
    console.log(firebase.firestore.FieldValue.serverTimestamp());

    const chatRef = db.collection('chats').doc(id);

    const userRef = db.collection('users').doc(recipientId);
    const userDoc = await userRef.get();

    const user = userDoc.data();
    if (user && auth.currentUser.uid !== user.uid) {
      try {
        const docSnapshot = await chatRef.get();
        await chatRef
          .set({
            // Add any additional chat properties you need here
            lastMessage: message.text,
            lastMessageUserId: auth.currentUser.uid,
            users: [auth.currentUser.uid, recipientId],
            // userReferences: [firebase.firestore.DocumentReference(db.collection('users').doc(auth.currentUser.uid)), firebase.firestore.DocumentReference(db.collection('users').doc(id))]
            // Add or update the references in the users document
          })
          .then(async r => {
            console.log('Chat created');

            // Add the chat reference to the users document
            db.collection('users')
              .doc(auth.currentUser.uid)
              .update({
                chats: firebase.firestore.FieldValue.arrayUnion(id),
              })
              .then(r => {
                console.log('Chat reference added to user');
              })
              .catch(e => {
                console.error('Error adding chat reference to user:', e);
              });
          })
          .then(async r => {
            console.log('Chat created');
            await db
              .collection('users')
              .doc(user.uid)
              .update({
                chats: firebase.firestore.FieldValue.arrayUnion(id),
              })
              .then(r => {
                console.log('Chat reference added to user');
              })
              .catch(e => {
                console.error('Error adding chat reference to user:', e);
              });
          })
          .catch(e => {
            console.error('Error creating chat:', e);
          });
      } catch (error) {
        console.error('Error creating chat:', error);
      }
    } else {
      console.log('User not found');
    }

    try {
      await chatRef.collection('messages').add({
        ...message,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        received: false,
        image: message.image ? message.image : null,
      });

      await chatRef.update({
        lastMessage: message.text,
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const toggleCameraType = () => {
    setType(current =>
      current === CameraType.back ? CameraType.front : CameraType.back,
    );
  };
  const handleCameraPress = () => {
    setCapturePressed(prevCapturePressed => !prevCapturePressed);
  };

  const pickImage = async () => {
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

  const takePhoto = async () => {
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    if (status === 'granted') {
      const result = await Camera.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.cancelled) {
        // Send the image message
        const source = {uri: result.uri};
        setImage(source);
        setUploadPhoto(true);
        await sendImage(result.uri);
      }
    }
  };

  const removeImage = () => {
    setImage(null);
    setUploadPhoto(false);
  };

  const uploadImage = async () => {
    const {uri} = image;
    const userId = auth.currentUser.uid;
    const user = auth.currentUser;
    const path = `images/chatImages/${id}/${userId}.jpg`;

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
    const uploadTask = uploadBytesResumable(storageRef, blob);
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      'state_changed',
      snapshot => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
        setImage(null);
        Alert.alert(
          'Photo uploaded!',
          'Your photo has been uploaded to Firebase Cloud Storage!',
        );
        //perform your task
      },
    );
  };

  const sendImage = async imageUri => {
    const imageName = `${auth.currentUser.uid}_${new Date().getTime()}.jpg`;
    const imageURL = await uploadImage(imageUri, imageName);

    const imageMessage = {
      _id: Math.random().toString(36).substring(7),
      text: '',
      createdAt: new Date(),
      user: {
        _id: auth.currentUser.uid,
        name: currentUser.name,
        avatar: currentUser.avatarPhotoUrl,
      },
      image: imageURL,
    };

    await onSend([imageMessage]);
  };

  const renderBubble = props => {
    return (
      <View style={{marginBottom: 1}}>
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: '#2089dc',
              marginBottom: 1,
            },
            left: {
              backgroundColor: 'white',
            },
          }}
          textStyle={{
            right: {
              color: 'white',
            },
            left: {
              color: 'black',
            },
          }}
        />
      </View>
    );
  };

  const renderSend = props => {
    return (
      <View style={{marginBottom: 1}}>
        <Send {...props}>
          <MaterialIcons name="send" size={32} color="#2089dc" />
        </Send>
      </View>
    );
  };

  const renderInputToolbar = props => (
    <View
      style={{
        flex: 1,
        marginBottom: 10,
        marginRight: 20,
        marginLeft: 20,
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderRadius: 11,
      }}>
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: 'white',
        }}
      />
    </View>
  );

  const renderMessageImage = props => {
    const {currentMessage} = props;
    return (
      <View style={{marginBottom: 1}}>
        image={currentMessage.image}
        <MessageImage
          imageProps={{resizeMode: 'cover'}}
          {...props}
          imageStyle={{
            left: {
              width: 200,
              height: 200,
            },
            right: {
              width: 200,
              height: 200,
            },
          }}
        />
      </View>
    );
  };

  const renderBackdropContent = () => (
    <View style={styles.blurredOverlay}>
      {/* You can place any content you want to be displayed over the blurred area here */}
      <Button
        onPress={() => navigation.navigate('Chats', {id: recipientId})}
        style={{alignSelf: 'flex-start', marginLeft: 10, marginTop: 50}}
        size="small"
        mode="text"
        compact={true}>
        <MaterialIcons name="arrow-back" size={12} color="black" />
        Back
      </Button>
      <View style={styles.avatarContainer}>
        <Avatar.Image source={{uri: recipient.avatarPhotoUrl}} size={50} />
        <Text style={styles.name}>{recipient.name}</Text>
      </View>
    </View>
  );

  return (
    <>
      {recipient && currentUser && (
        <View style={styles.container}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{
              flex: 1,
              marginBottom: 15,
              backgroundColor: 'white',
            }}
            keyboardVerticalOffset={-400}>
            <GiftedChat
              messages={messages}
              onSend={newMessages => onSend(newMessages)}
              user={{
                _id: currentUser ? currentUser.uid : null,
                name: currentUser ? currentUser.name : null,
                avatar: currentUser ? currentUser.avatarPhotoUrl : null,
              }}
              renderBubble={renderBubble}
              renderSend={renderSend}
              alwaysShowSend={true}
              renderAvatar={() => (
                <Avatar.Text
                  label={(() => {
                    // Split the name into two parts
                    const nameParts = recipient.name.split(' ');
                    // Get the first letter of each part
                    const firstLetters = nameParts.map(part => part[0]);
                    // Join the first letters together
                    const initials = firstLetters.join('');
                    return initials;
                  })()}
                  size={30}
                />
              )}
              renderInputToolbar={renderInputToolbar}
              renderMessageImage={renderMessageImage}
            />
            <BlurView intensity={80} style={styles.blurView}>
              {renderBackdropContent()}
            </BlurView>
          </KeyboardAvoidingView>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
  },
  backPanel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  header: {
    /* Create a blurred background */
    backgroundColor: 'white',
    height: 100,
    /* make it a row */
    flexDirection: 'row',
    marginBottom: 15,
  },
  backgroundImage: {
    flex: 1,
  },
  blurredContainer: {
    height: '25%', // Top 4th of the screen
  },
  blurredOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.6)', // Adjust the opacity to control the blur effect
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  avatarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MessagingScreen;
