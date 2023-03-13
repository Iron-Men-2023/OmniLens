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

const FriendsPage = ({navigation,route}) => {
  const [users, setUsers] = useState([]);
  const {user} = route.params || auth.currentUser.uid
  const [emails, setEmails] = useState([]);
  const userListRef = useRef(null)
  const emailsRef = useRef([])
  emailsRef.current = emails
  userListRef.current = users;
  console.log(user,"usrs")
  useEffect(() => {
   getUserById(user)
   .then(doc=> {
      const userData = doc.userDoc;

     userData.friends.forEach(friend => {
        getUserById(friend)
          .then(a=>{
            if(!emailsRef.current.includes(a.userDoc.email))
            {
              setUsers([{
                id: a.userDoc.id,
                name: a.userDoc.name,
                photoUrl: a.userDoc.avatarPhotoUrl,
                friendStatus: <Text style={styles.friendStatus}>Friends</Text>,
              },...userListRef.current]);
              setEmails([a.userDoc.email,...emailsRef.current])
            }
          }).catch(e => console.log(e))
      });
      console.log(userrs)
    }).catch(e => console.log('es2', e));
  }, [])


  const getFriendStatus = userData => {
    const currentUser = auth.currentUser;
    const friends = userData.friends || [];
    if (friends.includes(currentUser.uid)) {
      return <Text style={styles.friendStatus}>Friends</Text>;
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
                source={require('../../assets/Logo.png')}
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

export default FriendsPage;
