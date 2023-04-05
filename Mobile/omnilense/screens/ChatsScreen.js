import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import {Avatar, ListItem, SearchBar} from 'react-native-elements';
import {db, auth} from '../config/firebaseConfig';
import dimensions from "../config/DeviceSpecifications";

const ChatsScreen = ({navigation}) => {
    const [chats, setChats] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [userData, setUserData] = useState({});


    useEffect(() => {
        const fetchUserChats = async () => {
            // Retrieve the user's document using their ID
            const userDoc = await db.collection('users').doc(auth.currentUser.uid).get();
            const userChats = userDoc.data().chats;
            for (let chatId of userChats) {
                const chatRef = db.collection('chats').doc(chatId);
                const chatDoc = await db.collection('chats').doc(chatId).get();
                const chatData = chatDoc.data();

                if (chatData && chatData.users) {
                    const recipient = chatData.users.find(user => user !== auth.currentUser.uid);
                    const itemInfo = await getItemInfo(chatData);
                    if (itemInfo) {
                        setUserData(prevUserData => ({
                            ...prevUserData,
                            [recipient]: itemInfo,
                        }));
                    }
                    // Set up a listener for each chat reference stored in the user's document
                    const unsubscribe = chatRef.onSnapshot(chatSnapshot => {
                        setChats(prevChats => {
                            const updatedChat = {
                                id: chatDoc.id,
                                data: chatDoc.data(),
                            };

                            const chatIndex = prevChats.findIndex(chat => chat.id === chatDoc.id);

                            if (chatIndex !== -1) {
                                // Update the existing chat in the state
                                const updatedChats = [...prevChats];
                                updatedChats[chatIndex] = updatedChat;
                                return updatedChats;
                            } else {
                                // Add the new chat to the state
                                return [...prevChats, updatedChat];
                            }
                        });
                    });
                    () => unsubscribe();
                } else {
                    console.log("Error: Chat data or users array is undefined.");
                }
            }
        };

        fetchUserChats().then(r => console.log('User chats fetched'));
    }, []);

    const filteredChats = chats.filter(chat => {
        if (searchText === '') {
            return chat;
        } else {
            // Get the recipient ID from the chat
            const recipient = chat.data.users.find(user => user !== auth.currentUser.uid);

            // Get recipient data from userData
            const recipientData = userData[recipient];

            // If recipientData is available and it has a name property, filter by the name
            if (recipientData && recipientData.name) {
                return recipientData.name.toLowerCase().includes(searchText.toLowerCase());
            } else {
                return chat;
            }
        }
    });


    const enterChat = (id, chat) => {
        // Get the user from the users array in chat that is not the current user
        const recipient = chat.data.users.find(user => user !== auth.currentUser.uid);
        navigation.navigate('Messages', {id: id, recipientId: recipient})

    };

    async function getItemInfo(item) {
        const chatData = item;

        if (chatData) {
            const recipient = chatData.users.find(user => user !== auth.currentUser.uid);
            const userRef = await db.collection('users').doc(recipient).get();
            const userData = userRef.data();
            if (userData) {
                return userData;
            }
        } else {
            console.log("chat data was undefined");
        }
        return null;
    }

    return (
        <View>
            <SearchBar
                placeholder="Search Chats"
                onChangeText={text => setSearchText(text)}
                value={searchText}
                lightTheme={true}
                round={true}
                containerStyle={styles.container}
                style={styles.search}
            />
            <FlatList
                data={filteredChats}
                keyExtractor={item => item.id}
                style={styles.container}
                renderItem={({item}) => {
                    const recipient = item.data.users.find(user => user !== auth.currentUser.uid);
                    const itemInfo = userData[recipient];
                    return (
                        <>{itemInfo ? (
                            <ListItem onPress={() => enterChat(item.id, item)} bottomDivider>
                                <Avatar source={{uri: itemInfo.avatarPhotoUrl}} rounded/>
                                <ListItem.Content>
                                    <ListItem.Title>{itemInfo.name}</ListItem.Title>
                                    <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                                        {item.data.lastMessage}
                                    </ListItem.Subtitle>
                                </ListItem.Content>
                                <ListItem.Chevron/>
                            </ListItem>
                        ) : (
                            <ListItem.CheckBox title="Loading..." checked={false}/>
                        )}</>
                    );
                }}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        marginBottom: 24,
        marginTop: 40,

    },
    text: {
        fontSize: 20,
        color: "#000",
        fontWeight: "bold",
        marginLeft: 10,
    },
    search: {
        width: dimensions.width,
        height: 50,
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10,
        margin: 10,
        fontSize: 20,
    },
    message: {
        width: dimensions.width,
        height: 50,
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10,
        margin: 10,
        fontSize: 20,
    },
});
export default ChatsScreen;
