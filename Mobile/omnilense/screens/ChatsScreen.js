import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import {Avatar, ListItem, SearchBar} from 'react-native-elements';
import {db, auth} from '../config/firebaseConfig';
import dimensions from "../config/DeviceSpecifications";

const ChatsScreen = ({navigation}) => {
    const [chats, setChats] = useState([]);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        const unsubscribe = db.collection('chats').onSnapshot(snapshot => {
            setChats(
                snapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data(),
                })),
            );
        });

        return unsubscribe;
    }, []);

    const filteredChats = chats.filter(chat => {
        console.log('To filter: ', chat);
        if (searchText === '') {
            return chat;
        } else {
            console.log('To filter: ', chat);
            return chat.data.name.toLowerCase().includes(searchText.toLowerCase());
        }
    });

    const enterChat = (id, chatName) => {
        navigation.navigate('Messages', {
            id,
            chatName,
        });
    };

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
                renderItem={({item}) => (
                    <ListItem onPress={() => enterChat(item.id, item.data.name)} bottomDivider>
                        <Avatar source={{uri: item.data.imageUrl}} rounded/>
                        <ListItem.Content>
                            <ListItem.Title>{item.data.name}</ListItem.Title>
                            <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                                {item.data.lastMessage}
                            </ListItem.Subtitle>
                        </ListItem.Content>
                        <ListItem.Chevron/>
                    </ListItem>
                )}
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
