// Import required dependencies and add them to the top of your file
import {Bubble, GiftedChat, InputToolbar, Send} from 'react-native-gifted-chat';
import {MaterialIcons} from '@expo/vector-icons';
import React, {useEffect, useState} from "react";
import {auth, db} from "../config/firebaseConfig";
import {ImageBackground, StyleSheet, TouchableOpacity, View} from "react-native";
import firebase from 'firebase/compat/app';
import {LinearGradient} from 'expo-linear-gradient';
import {getUserById} from "../config/DB_Functions/DB_Functions";
import {Button, useTheme, Avatar, Text} from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as Camera from 'expo-camera';

// Create ChatScreen component
const MessagingScreen = ({navigation, route}) => {
    const {id, chatName, recipientId} = route.params;
    const [messages, setMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [recipient, setRecipient] = useState(null);
    const {colors} = useTheme();

    useEffect(() => {
        const fetchUserData = async () => {
            const currentUserData = await db.collection('users').doc(auth.currentUser.uid).get().then(doc => doc.data());
            console.log("Current User: ", currentUserData);
            setCurrentUser(currentUserData);

            const recipientData = await db.collection('users').doc(recipientId).get().then(doc => doc.data());
            console.log("Recipient: ", recipientData);
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
                        _id: doc.data()._id,
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

        const chatRef = db.collection("chats").doc(id);

        const userRef = db.collection("users").doc(recipientId);
        const userDoc = await userRef.get();

        const user = userDoc.data();
        if (user && auth.currentUser.uid !== user.uid) {
            try {
                const docSnapshot = await chatRef.get();
                await chatRef.set({
                    // Add any additional chat properties you need here
                    lastMessage: message.text,
                    lastMessageUserId: auth.currentUser.uid,
                    users: [auth.currentUser.uid, recipientId],
                    // userReferences: [firebase.firestore.DocumentReference(db.collection('users').doc(auth.currentUser.uid)), firebase.firestore.DocumentReference(db.collection('users').doc(id))]
                    // Add or update the references in the users document
                }).then(async r => {
                    console.log('Chat created');

                    // Add the chat reference to the users document
                    db.collection('users').doc(auth.currentUser.uid).update({
                        chats: firebase.firestore.FieldValue.arrayUnion(id)
                    }).then(r => {
                        console.log('Chat reference added to user');
                    }).catch(e => {
                            console.error('Error adding chat reference to user:', e);
                        }
                    );

                }).then(async r => {
                    console.log('Chat created');
                    await db.collection('users').doc(user.uid).update({
                        chats: firebase.firestore.FieldValue.arrayUnion(id)
                    }).then(r => {
                        console.log('Chat reference added to user');

                    }).catch(e => {
                            console.error('Error adding chat reference to user:', e);
                        }
                    );
                }).catch(e => {
                    console.error('Error creating chat:', e);
                });

            } catch (error) {
                console.error("Error creating chat:", error);
            }
        } else {
            console.log("User not found");
        }


        try {
            await chatRef.collection("messages").add({
                ...message,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });

            await chatRef.update({
                lastMessage: message.text,
            });
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };


    const renderBubble = (props) => {
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

    const renderSend = (props) => {
        return (
            <Send {...props}>
                <View>
                    <MaterialIcons name="send" size={32} color="#2089dc"/>
                </View>
            </Send>
        );
    };

    const pickImage = async () => {
        const {status} = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
        if (status === 'granted') {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
            });

            if (!result.cancelled) {
                // Send the image message
            }
        }
    };

    const takePhoto = async () => {
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        if (status === 'granted') {
            const result = await Camera.launchCameraAsync({
                mediaTypes: Camera.MediaTypeOptions.Images,
                quality: 1,
            });

            if (!result.cancelled) {
                // Send the image message
            }
        }
    };

    const renderInputToolbar = (props) => (

        <View style={{
            flexDirection: 'row', marginBottom: 10,
        }}>
            <InputToolbar
                {...props}
                containerStyle={{
                    backgroundColor: 'white',
                    borderTopWidth: 1,
                    borderTopColor: '#e5e5e5',
                    marginRight: 15,
                    marginLeft: 85,
                    borderRadius: 10,
                }}
            />
            <TouchableOpacity onPress={pickImage} style={{marginLeft: 7, marginBottom: 5}}>
                <MaterialIcons name="photo-library" size={32} color="#2089dc"/>
            </TouchableOpacity>
            <TouchableOpacity onPress={takePhoto} style={{marginLeft: 10, marginBottom: 5}}>
                <MaterialIcons name="camera-alt" size={32} color="#2089dc"/>
            </TouchableOpacity>
        </View>
    );

    return (
        <>{recipient && currentUser && (
            <View style={{flex: 1, marginBottom: 15}}>
                <Button
                    onPress={() => navigation.navigate('Chats', {id: recipientId})}
                    style={{margin: 50}}
                    mode="contained"
                    color="#2089dc"
                >
                    Back to {currentUser.name}'s Messages
                </Button>
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
                    renderUsernameOnMessage
                    renderQuickReplySend={props => (
                        <Send {...props}>
                            <View>
                                <MaterialIcons name="send" size={32} color="#2089dc"/>
                            </View>
                        </Send>
                    )}
                    renderAvatar={() =>
                        <Avatar.Image
                            source={{uri: recipient.avatarPhotoUrl}}
                            size={40}
                        />
                    }
                    renderInputToolbar={renderInputToolbar}
                />
                <>
                    <View style={styles.backPanel}>
                        <ImageBackground
                            source={{uri: "https://images.unsplash.com/photo-1589988874319-8e8b0b2b0b1a?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Mnx8YmFja2dyb3VuZCUyMHBob3Rvc3xlbnwwfDB8MHx8&ixlib=rb-1.2.1&w=1000&q=80"}}
                            style={{width: '100%', height: '100%'}}
                            blurRadius={10}
                        />
                    </View>
                </>
            </View>
        )}</>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 35,
    },
    backPanel: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: -1,
    },
});


export default MessagingScreen;
