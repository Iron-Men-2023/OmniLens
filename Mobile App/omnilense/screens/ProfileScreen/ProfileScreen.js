import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import fetchUserData from '../../src/DB_Functions/DB_Functions';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [userSet, setUserSet] = useState(false);

  useEffect(() => {
    if (user) {
      return;
    }
    fetchUserData()
      .then(r => {
        console.log('user data: ', r);
        setUser(r.userDoc);
        setUserSet(true);
      })
      .catch(e => console.log('e1', e));
  }, [user]);

  return (
    <>
      {user ? (
        <>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              {/*<ProfilePhoto />*/}
              <Text style={styles.name}>{user.username}</Text>
              <Text style={styles.bio}>{user.bio}</Text>
            </View>
          </View>
          {/*<Posts />*/}
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  header: {
    backgroundColor: '#F5FCFF',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  headerContent: {
    alignItems: 'center',
  },
  bio: {
    fontSize: 16,
    color: '#696969',
    marginTop: 10,
    textAlign: 'center',
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    color: '#000000',
    fontWeight: '600',
  },
  postContainer: {
    margin: 10,
  },
  post: {
    backgroundColor: 'grey',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  postText: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default ProfilePage;
