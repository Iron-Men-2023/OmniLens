import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {auth, db} from '../../config/firebaseConfig';
import firebase from 'firebase/compat/app';
import {getAllUsersData} from '../../config/DB_Functions/DB_Functions';

const FriendRequestsScreen = () => {
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    const currentUser = auth.currentUser;
    const unsubscribe = db
      .collection('users')
      .doc(currentUser.uid)
      .onSnapshot(async doc => {
        const data = doc.data();
        const friendRequestsData = data.friendRequests;
        console.log(friendRequestsData);
        try {
          const friendData = await getAllUsersData(friendRequestsData);
          setFriendRequests(friendData);
        } catch (error) {
          console.log(error);
        }
      });

    return () => unsubscribe();
  }, []);

  // useEffect(() => {
  //   // setFriendRequests when friendRequests changes
  //   setFriendRequests([...friendRequests]);
  // }, [friendRequests]);

  const acceptRequest = async requestId => {
    const currentUser = auth.currentUser;
    const requestRef = db.collection('users').doc(requestId);
    const currentUserRef = db.collection('users').doc(currentUser.uid);
    try {
      await requestRef.update({
        friends: firebase.firestore.FieldValue.arrayUnion(currentUser.uid),
      });
      await currentUserRef.update({
        friends: firebase.firestore.FieldValue.arrayUnion(requestId),
      });
    } catch (error) {
      console.log('Error accepting friend request:', error);
    }
    await db
      .collection('users')
      .doc(currentUser.uid)
      .update({
        friendRequests: firebase.firestore.FieldValue.arrayRemove(requestId),
      });
    setFriendRequests(friendRequests.filter(req => req.id !== requestId));
    Alert.alert('Friend Request Accepted');
  };

  const rejectRequest = async requestId => {
    const currentUser = auth.currentUser;
    try {
      await db
        .collection('users')
        .doc(currentUser.uid)
        .update({
          friendRequests: firebase.firestore.FieldValue.arrayRemove(requestId),
        });
    } catch (error) {
      console.log('Errors rejecting friend request:', error);
    }
    setFriendRequests(friendRequests.filter(req => req.id !== requestId));
    Alert.alert('Friend Request Rejected');
  };

  const renderRequestItem = ({item}) => {
    return (
      <View style={{marginVertical: 10}}>
        <View style={styles.row}>
          <Image source={{uri: item.avatarPhotoUrl}} style={styles.photo} />
          <Text style={styles.name}>{item.name}</Text>
          <Button
            title="Accept"
            style={styles.addButton}
            onPress={() => acceptRequest(item.uid)}
          />
          <Button
            title="Reject"
            style={styles.addButton}
            onPress={() => rejectRequest(item.id)}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {friendRequests.length === 0 ? (
        <Text>No friend requests at this time.</Text>
      ) : (
        <FlatList
          data={friendRequests}
          renderItem={renderRequestItem}
          keyExtractor={item => item.uid}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
export default FriendRequestsScreen;
