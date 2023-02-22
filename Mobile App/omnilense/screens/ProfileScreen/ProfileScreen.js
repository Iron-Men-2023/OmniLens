import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {fetchUserData} from '../../config/DB_Functions/DB_Functions';
import ProfilePhotoComponent from '../../components/ProfilePhotoComponent';

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
    <ScrollView style={styles.scrollView}>
      {user ? (
        <View style={styles.container}>
          <View style={styles.header}>
            {/* Placeholder for cover photo */}
            {/*<ProfilePhotoComponent*/}
            {/*  imageStyle={styles.coverPhoto}*/}
            {/*  photoType={'Cover'}*/}
            {/*/>*/}
            {/* Placeholder for profile picture */}
            <ProfilePhotoComponent
              imageStyle={styles.avatar}
              photoType={'Avatar'}
            />
            <Text style={styles.name}>{user.username}</Text>
            <Text style={styles.bio}>Bio: {user.bio}</Text>
          </View>
          <View style={styles.stats}>
            {/* Placeholder for friends list */}
            <Text style={styles.statText}>Friends: 10</Text>
            {/* Placeholder for social media links */}
            <Text style={styles.statText}>Instagram: @johndoe</Text>
            <Text style={styles.statText}>Twitter: @johndoe</Text>
            {/* Add more stats and links as needed */}
          </View>
          {/*<Posts />*/}
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    paddingBottom: 10,
  },
  coverPhoto: {
    width: '100%',
    height: 150,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    position: 'absolute',
    marginTop: 80,
  },
  name: {
    fontSize: 22,
    color: '#000000',
    fontWeight: '600',
    marginTop: 70,
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  bio: {
    fontSize: 16,
    color: '#696969',
    marginTop: 10,
    textAlign: 'center',
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  stats: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#F5FCFF',
  },
  statText: {
    fontSize: 16,
    marginBottom: 10,
  },
  headerContent: {
    alignItems: 'center',
  },
});

export default ProfilePage;
