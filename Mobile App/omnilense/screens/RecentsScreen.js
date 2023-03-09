import React, {useState, useEffect} from 'react';
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

const RecentsScreen = ({navigation}) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const unsubscribe = db.collection('users').onSnapshot(snapshot => {
            const usersList = [];
            snapshot.forEach(doc => {
                if (doc.uid !== auth.currentUser.uid) {
                    const userData = doc.data();
                    const recents = userData.recents || [];

                    if (recents.includes(auth.currentUser.uid)) {
                        usersList.push({
                            id: doc.id,
                            name: userData.name,
                            photoUrl: userData.avatarPhotoUrl,
                            friendStatus: <Text style={styles.friendStatus}>Friends</Text>,
                        });
                    }
                }
            });
            setUsers(usersList);
        });
        return unsubscribe;
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
