// Import required dependencies and add them to the top of your file
import {Bubble, GiftedChat, Send} from 'react-native-gifted-chat';
import {MaterialIcons} from '@expo/vector-icons';
import {useEffect, useState} from "react";
import {db, auth} from "../config/firebaseConfig";
import {StyleSheet, View} from "react-native";
import firebase from 'firebase/compat/app';
import {getUserById} from "../config/DB_Functions/DB_Functions";

// Create ChatScreen component
const MessagingScreen = ({navigation, route}) => {

    const {id, chatName} = route.params;
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = db
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

        return unsubscribe;
    }, [route]);


    const onSend = (newMessages = []) => {
        const message = newMessages[0];
        console.log(message);
        console.log(firebase.firestore.FieldValue.serverTimestamp());

        const chatRef = db.collection('chats').doc(id);

        chatRef.get().then(async (docSnapshot) => {
            if (!docSnapshot.exists) {
                try {
                    // Make sure you're passing the correct ID to getUseById
                    const recipientId = id;
                    const userData = await getUserById(recipientId);
                    const user = userData.userDoc;
                    console.log('User object:', user);
                    console.log('User ID:', user.uid);

                    if (user) {
                        await chatRef.set({
                            // Add any additional chat properties you need here
                            lastMessage: message.text,
                            recipientId: user.uid,
                            recipientName: user.name,
                            recipientAvatarPhotoURL: user.avatarPhotoUrl,
                        });
                    } else {
                        console.error('User not found');
                    }
                } catch (error) {
                    console.error('Error fetching user:', error);
                }
            }
        });

        chatRef.collection('messages')
            .add({
                ...message,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            }).then(r => {
            chatRef.update({
                lastMessage: message.text,
            });
        });
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
        <View style={styles.container}>
            <GiftedChat
                messages={messages}
                onSend={newMessages => onSend(newMessages)}
                user={{
                    _id: auth.currentUser.uid,
                    name: auth.currentUser.displayName,
                    avatar: auth.currentUser.photoURL,
                }}
                renderBubble={renderBubble}
                renderSend={renderSend}
                alwaysShowSend
                scrollToBottom
                scrollToBottomComponent={() => <MaterialIcons name="expand-more" size={32} color="#2089dc"/>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        marginBottom: 20,
    },
});

export default MessagingScreen;
