// Import required dependencies and add them to the top of your file
import {Bubble, GiftedChat, Send} from 'react-native-gifted-chat';
import {MaterialIcons} from '@expo/vector-icons';
import {useEffect, useState} from "react";
import {db, auth} from "../config/firebaseConfig";
import {StyleSheet, View} from "react-native";
import firebase from 'firebase/compat/app';

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
        db.collection('chats')
            .doc(id)
            .collection('messages')
            .add({
                ...message,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            }).then(r =>
            db.collection('chats')
                .doc(id)
                .update({
                    lastMessage: message.text,
                })
        );

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
