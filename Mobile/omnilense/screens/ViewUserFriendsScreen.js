import React, {useState, useEffect, useRef} from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Pressable,
} from 'react-native';
import {getUserById} from "../config/DB_Functions/DB_Functions";
import {auth, db} from "../config/firebaseConfig";
import firebase from "firebase/compat/app";


const ViewUserFriendsScreen = ({navigation, route}) => {
    const [users, setUsers] = useState([]);
    const {userData} = route.params
    const [emails, setEmails] = useState([]);
    const userListRef = useRef(null)
    const emailsRef = useRef([])
    emailsRef.current = emails
    userListRef.current = users;

    useEffect(() => {
        let userList = [];
        userData.friends.forEach(friend => {
            getUserById(friend)
                .then(a => {
                    console.log("USER: ", a.userDoc)
                    userList.push({
                        userData: a.userDoc,
                    });

                }).catch(e => console.log(e))
        });
        setUsers(userList);

    }, [])


    return (
        <View>
            {users.map(user => (
                <View style={styles.row} key={user.id}>
                    {user.photoUrl ? (
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
                    ) : (
                        <Pressable
                            style={({pressed}) => [
                                {backgroundColor: pressed ? 'black' : 'white'},
                                styles.photo,
                            ]}
                            onPress={() =>
                                navigation.navigate('OtherUserProfile', {userData: user.userData})
                            }>
                            <Image
                                source={require('../assets/Logo.png')}
                                style={styles.photo}
                            />{' '}
                        </Pressable>
                    )}
                    <Text style={styles.name}>{user.name}</Text>
                    <View>{user.friendStatus}</View>
                </View>
            ))}
        </View>
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
    },
});

export default ViewUserFriendsScreen;
