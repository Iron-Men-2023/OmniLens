import React, {useState, useEffect, useRef} from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Pressable,
} from 'react-native';
import {auth, storage, db, firebaseApp} from '../../config/firebaseConfig';
import firebase from 'firebase/compat/app';
import {getUserById} from "../../config/DB_Functions/DB_Functions";
import * as PropTypes from "prop-types";
import {Searchbar} from "react-native-paper";

function FriendsList(props) {
    const {friends, navigation} = props;

    return (
        <>
            {friends.length === 0 && (
                <View style={styles.noFriendsContainer}>
                    <Text style={styles.noFriendsText}>
                        No friends with that name, or you need to add them!
                    </Text>
                </View>
            )}
            {friends.map(user => (
                <View style={styles.row} key={user.id}>
                    {user.photoUrl ? (
                        <Pressable
                            style={({pressed}) => [
                                {backgroundColor: pressed ? 'black' : 'white'},
                                styles.photo,
                            ]}
                            onPress={() =>
                                navigation.navigate('OtherUserProfile', {uid: user.id})
                            }>
                            <Image style={styles.photo} source={{uri: user.photoUrl}}/>
                        </Pressable>
                    ) : (
                        <Pressable
                            style={({pressed}) => [
                                {backgroundColor: pressed ? 'black' : 'white'},
                                styles.photo,
                            ]}
                            onPress={() =>
                                navigation.navigate('OtherUserProfile', {uid: user.id})
                            }>
                            <Image
                                source={require('../../assets/Logo.png')}
                                style={styles.photo}
                            />{' '}
                        </Pressable>
                    )}
                    <Text style={styles.name}>{user.name}</Text>
                    <View style={styles.friendStatusContainer}>{user.friendStatus}</View>
                </View>
            ))}
        </>
    );
}

FriendsList.propTypes = {friends: PropTypes.arrayOf(PropTypes.any)};
const FriendsPage = ({navigation, route}) => {
    const [users, setUsers] = useState([]);
    const [emails, setEmails] = useState([]);
    const userListRef = useRef(null)
    const emailsRef = useRef([])
    const [friends, setFriends] = useState([]);
    const [searchText, setSearchText] = useState('');
    emailsRef.current = emails
    userListRef.current = users;

    function filterFriends(search) {
        if (search === '') {
            return friends;
        }
        return friends.filter(friend => friend.name.toLowerCase().includes(search.toLowerCase()));
    }

    useEffect(() => {
        console.log('user', auth.currentUser.uid)
        getUserById(auth.currentUser.uid)
            .then(doc => {
                const userData = doc.userDoc;

                if (userData.friends === null) {
                    setFriends([]);
                    return;
                }

                userData.friends.forEach(friend => {
                    getUserById(friend)
                        .then(a => {
                            console.log("Usersss: ", a.userDoc)
                            if (!emailsRef.current.includes(a.userDoc.email)) {
                                setFriends([{
                                    id: a.userDoc.uid,
                                    name: a.userDoc.name,
                                    photoUrl: a.userDoc.avatarPhotoUrl,
                                    friendStatus: <Text style={styles.friendStatus}>Friends</Text>,
                                }, ...userListRef.current]);
                                setEmails([a.userDoc.email, ...emailsRef.current])
                            }
                        }).catch(e => console.log(e))
                });
            }).then(r => console.log("Friends: ", friends)).catch(e => console.log('es2', e));
    }, [])


    return (

        <View style={{flex: 1, backgroundColor: '#f1ecec'}}>
            <View style={{flex: 1}}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Friends</Text>
                </View>

                <Searchbar
                    style={styles.searchBar}
                    placeholder="Search"
                    onChangeText={query => {
                        setSearchText(query)
                    }}
                    value={searchText}
                />
                <View style={styles.friendsList}>
                    <FriendsList friends={filterFriends(searchText)} navigation={navigation}/>
                </View>
            </View>
        </View>

        // <View>
        //     {friends.map(user => (
        //         <View style={styles.row} key={user.id}>
        //             {user.photoUrl ? (
        //                 <Pressable
        //                     style={({pressed}) => [
        //                         {backgroundColor: pressed ? 'black' : 'white'},
        //                         styles.photo,
        //                     ]}
        //                     onPress={() =>
        //                         navigation.navigate('OtherUserProfile', {uid: user.id})
        //                     }>
        //                     <Image style={styles.photo} source={{uri: user.photoUrl}}/>
        //                 </Pressable>
        //             ) : (
        //                 <Pressable
        //                     style={({pressed}) => [
        //                         {backgroundColor: pressed ? 'black' : 'white'},
        //                         styles.photo,
        //                     ]}
        //                     onPress={() =>
        //                         navigation.navigate('OtherUserProfile', {uid: item.uid})
        //                     }>
        //                     <Image
        //                         source={require('../../assets/Logo.png')}
        //                         style={styles.photo}
        //                     />{' '}
        //                 </Pressable>
        //             )}
        //             <Text style={styles.name}>{user.name}</Text>
        //             <View>{user.friendStatus}</View>
        //         </View>
        //     ))}
        // </View>

    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
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
    },
    addButton: {
        backgroundColor: '#007AFF',
        borderRadius: 5,
        padding: 5,
    },
    addButtonText: {
        color: '#FFFFFF',
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
    }, friendStatusContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        padding: 5,
    },
    header: {
        backgroundColor: '#FFFFFF',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    searchBar: {
        backgroundColor: '#FFFFFF',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    searchBarText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    friendsList: {
        backgroundColor: '#FFFFFF',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    }, noFriendsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noFriendsText: {
        fontSize: 20,
        fontWeight: 'bold',
    }
});

export default FriendsPage;
