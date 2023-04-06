// Import required dependencies and add them to the top of your file
import {Bubble, GiftedChat, Send} from 'react-native-gifted-chat';
import {MaterialIcons} from '@expo/vector-icons';
import {useEffect, useState} from "react";
import {auth, db} from "../config/firebaseConfig";
import {StyleSheet, View} from "react-native";
import firebase from 'firebase/compat/app';
import {LinearGradient} from 'expo-linear-gradient';
import {getUserById} from "../config/DB_Functions/DB_Functions";
import {Button} from "react-native-paper";

// Create ChatScreen component
const MessagingScreen = ({navigation, route}) => {
    const {id, chatName, recipientId} = route.params;
    const [messages, setMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [recipient, setRecipient] = useState(null);

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
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#2089dc',
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

    return (
        <>{recipient && currentUser && (
            <LinearGradient
                colors={['#8a2be2', '#4b0082', '#800080']}
                style={styles.container}
            >
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
                    alwaysShowSend
                    scrollToBottom
                    scrollToBottomComponent={() => <MaterialIcons name="expand-more" size={32} color="#2089dc"/>}
                />
            </LinearGradient>
        )}</>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 35,
    },
});


export default MessagingScreen;
