import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Pressable,
} from 'react-native';
import {auth, storage, db, firebaseApp} from '../../config/firebaseConfig';
import firebase from 'firebase/compat/app';
import SearchInputComponent from '../../components/SearchInputComponent';
import {sendFriendRequest} from '../../config/DB_Functions/DB_Functions';
import {LinearGradient} from "expo-linear-gradient";
import {useTheme} from "react-native-paper";

const FriendsPage = ({navigation}) => {
    const [users, setUsers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedUsers, setSearchedUsers] = useState([]);
    const {colors} = useTheme();

    useEffect(() => {
        const unsubscribe = db.collection('users').onSnapshot(snapshot => {
            const usersList = [];
            snapshot.forEach(doc => {
                if (doc.id !== auth.currentUser.uid) {
                    const userData = doc.data();
                    const friendStatus = getFriendStatus(userData);
                    console.log("User Data is: ", userData);
                    usersList.push({
                        userData: userData,
                        friendStatus,
                    });
                }
            });
            setUsers(usersList);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (searchText !== '') {
            console.log('Searching for', searchText);
            console.log('Users are', users);
            const filteredUsers = users.filter(user =>
                user.userData.name.toLowerCase().includes(searchText.toLowerCase()),
            );
            setSearchedUsers(filteredUsers);
        } else {
            setSearchedUsers(users);
        }
    }, [searchText, users]);

    const dynamicSearch = text => {
        setSearchText(text);
    };

    const getFriendStatus = userData => {
        const currentUser = auth.currentUser;
        const friendRequests = userData.friendRequests || [];
        const friends = userData.friends || [];
        if (friends.includes(currentUser.uid)) {
            return <Text style={styles.friendStatus}>Friends</Text>;
        } else if (friendRequests.includes(currentUser.uid)) {
            return <Text style={styles.friendStatus}>Request Sent</Text>;
        } else {
            return (
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => sendFriendRequest(userData)}>
                    <Text style={styles.addButtonText}>Add Friend</Text>
                </TouchableOpacity>
            );
        }
    };

    return (
        <ScrollView>
            <SearchInputComponent changeText={dynamicSearch}/>
            {searchedUsers.map(user => (
                <View style={styles.row} key={user.userData.uid}>
                    <Pressable
                        style={({pressed}) => [
                            {backgroundColor: pressed ? 'black' : 'white'},
                            styles.photo,
                        ]}
                        onPress={() =>
                            navigation.navigate('OtherUserProfile', {userData: user.userData})
                        }>
                        <Image style={styles.photo} source={{uri: user.userData.avatarPhotoUrl}}/>
                    </Pressable>
                    <Text style={styles.name}>{user.userData.name}</Text>
                    <View>{user.friendStatus}</View>
                </View>
            ))}
            <View style={styles.backPanel}>
                <View style={{height: 300, backgroundColor: colors.primary}}/>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
        borderRadius: 10,
        margin: 10,
        backgroundColor: '#FFFFFF',
    },
    photo: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 16,
    },
    name: {
        fontWeight: 'bold',
        flex: 1,
        fontSize: 16,
        /* Make color gray */
        color: '#000',
    },
    addButton: {
        backgroundColor: '#007AFF',
        borderRadius: 5,
        padding: 5,
    },
    addButtonText: {
        color: '#F5FCFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    friendStatus: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: 'bold',
        borderRadius: 5,
        padding: 5,
        borderColor: '#007AFF',
    },
    container: {
        flex: 1,
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

export default FriendsPage;
