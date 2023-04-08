import React, {useState, useEffect, useRef} from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Pressable, ScrollView,
} from 'react-native';
import {auth, storage, db, firebaseApp} from '../../config/firebaseConfig';
import firebase from 'firebase/compat/app';
import {getUserById} from "../../config/DB_Functions/DB_Functions";
import * as PropTypes from "prop-types";
import {Searchbar, useTheme} from "react-native-paper";

function FriendsList(props) {
    const {friends, navigation} = props;
    console.log("Friends are: ", friends);
    return (
        <ScrollView>
            {friends.length === 0 && (
                <View style={styles.noFriendsContainer}>
                    <Text style={styles.noFriendsText}>
                        No friends with that name, or you need to add them!
                    </Text>
                </View>
            ) || friends.length > 0 && friends.map(user => (
                <View style={styles.row} key={user.uid}>
                    {user.avatarPhotoUrl ? (
                        <Pressable
                            style={({pressed}) => [
                                {backgroundColor: pressed ? 'black' : 'white'},
                                styles.photo,
                            ]}
                            onPress={() =>
                                navigation.navigate('OtherUserProfile', {userData: user})
                            }>
                            <Image style={styles.photo} source={{uri: user.avatarPhotoUrl}}/>
                        </Pressable>
                    ) : (
                        <Pressable
                            style={({pressed}) => [
                                {backgroundColor: pressed ? 'black' : 'white'},
                                styles.photo,
                            ]}
                            onPress={() =>
                                navigation.navigate('OtherUserProfile', {userData: user})
                            }>
                            <Image
                                source={require('../../assets/Logo.png')}
                                style={styles.photo}
                            />
                        </Pressable>
                    )}
                    <Text style={styles.name}>{user.name}</Text>
                    <View style={styles.friendStatusContainer}>
                        <Text style={styles.friendStatus}> Friends </Text>
                    </View>
                </View>
            ))}
        </ScrollView>
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
    const {colors} = useTheme();
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
                            if (!emailsRef.current.includes(a.userDoc.email)) {
                                setFriends([...friends, a.userDoc]);
                                setEmails([a.userDoc.email, ...emailsRef.current])
                            }
                        }).catch(e => console.log(e))
                });
            }).then(r => console.log("Friends: ", friends)).catch(e => console.log('es2', e));
    }, [])


    return (
        <>
            <View style={{flex: 1, margin: 10}}>
                <Searchbar
                    style={styles.searchBar}
                    placeholder="Search"
                    onChangeText={query => {
                        setSearchText(query)
                    }}
                    value={searchText}
                />
                <FriendsList friends={filterFriends(searchText)} navigation={navigation}/>
            </View>
            <View style={styles.backPanel}>
                <View style={{height: 300, backgroundColor: colors.primary}}/>
            </View>
        </>
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
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        marginTop: 10,
        borderRadius: 10,
    }, noFriendsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noFriendsText: {
        fontSize: 20,
        fontWeight: 'bold',
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
