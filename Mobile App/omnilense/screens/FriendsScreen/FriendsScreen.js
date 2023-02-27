import React, {useState, useEffect} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {auth, storage, db, firebaseApp} from '../../config/firebaseConfig';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const FriendsPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = db.collection('users').onSnapshot(snapshot => {
      const usersList = [];
      snapshot.forEach(doc => {
        if (doc.id !== auth.currentUser.uid) {
          const userData = doc.data();
          const friendStatus = getFriendStatus(userData);
          usersList.push({
            id: doc.id,
            name: userData.name,
            photoUrl: userData.avatarPhotoUrl,
            friendStatus,
          });
        }
      });
      setUsers(usersList);
    });
    return unsubscribe;
  }, []);

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

  const sendFriendRequest = userData => {
    const currentUser = auth.currentUser;
    db.collection('users')
      .doc(userData.uid)
      .update({
        friendRequests: firebase.firestore.FieldValue.arrayUnion(
          currentUser.uid,
        ),
      })
      .then(r => console.log('Friend request sent successfully!'))
      .catch(e => console.error('Error sending friend request:', e));
  };

  return (
    <View>
      {users.map(user => (
        <View style={styles.row} key={user.id}>
          <Image source={{uri: user.photoUrl}} style={styles.photo} />
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

export default FriendsPage;
