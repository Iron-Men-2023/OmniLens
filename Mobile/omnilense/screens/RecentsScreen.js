import React, {useState, useEffect, useRef} from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Pressable,
} from 'react-native';
import {auth, storage, db, firebaseApp} from '../config/firebaseConfig';
import firebase from 'firebase/compat/app';
import {getUserById} from "../config/DB_Functions/DB_Functions";

const RecentsScreen = ({navigation,route}) => {
    const {user} = route.params
    const [users, setUsers] = useState([]);
    const [recents,setRecents] = useState([])
    const recentsRef = useRef([])
    const usersRef = useRef([])

    recentsRef.current= recents
    usersRef.current= users

    useEffect(() => {
        const usersList = []
        getUserById(user)
            .then(r => {
                setRecents(r.userDoc.recents)
                recentsRef.current.forEach(ref=> {
                    getUserById(ref)
                        .then(a => {
                            setUsers([{
                                    id: a.id,
                                    name: a.name,
                                    photoUrl: a.avatarPhotoUrl,
                                    friendStatus: <Text style={styles.friendStatus}>Friends</Text>,
                                }, ...usersRef.current]);
                            })
                })
            }
        )
    }, []);

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
                                navigation.navigate('OtherUserProfile', {uid: user.id})
                            }>
                            <Image style={styles.photo} source={{uri: user.photoUrl}} />
                        </Pressable>
                    ) : (
                        <Pressable
                            style={({pressed}) => [
                                {backgroundColor: pressed ? 'black' : 'white'},
                                styles.photo,
                            ]}
                            onPress={() =>
                                navigation.navigate('OtherUserProfile', {uid: item.uid})
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

export default RecentsScreen;
