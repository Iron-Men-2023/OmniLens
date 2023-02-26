import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {fetchUserData} from '../../config/DB_Functions/DB_Functions';
import ProfilePhotoComponent from '../../components/ProfilePhotoComponent';
import dimensions from '../../config/DeviceSpecifications';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [userSet, setUserSet] = useState(false);
  const [userData, setUserData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUserData()
      .then(r => {
        console.log('user data: ', r.userDoc);
        setUser(r.userDoc);
        setUserSet(true);
        console.log('user issss: ', user);
      })
      .catch(e => console.log('e1', e));
  }, [userSet]);

  const onRefresh = async () => {
    setRefreshing(true);
    fetchUserData()
      .then(r => {
        try {
          setUserData(r.userDoc);
          console.log('user data: ', r.userDoc);
          setUser(r.userInfo);
          setUserSet(true);
        } catch (e) {
          console.log('e1', e);
        }
      })
      .catch(e => console.log('e2', e));
    // Perform the refresh logic here, such as fetching new data from an API.
    try {
      setTimeout(() => {
        setRefreshing(false);
      }, 2000);
    } catch (e) {
      console.log('e3', e);
    }
  };

  return (
    <ScrollView
      style={styles.scrollView}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {user ? (
        <View style={styles.container}>
          {/*</View>*/}
          <View style={styles.header}>
            {/*Placeholder for cover photo */}
            <ProfilePhotoComponent
              imageStyle={styles.coverPhoto}
              photoType={'Cover'}
              user={user}
            />
            <ProfilePhotoComponent
              imageStyle={styles.avatar}
              photoType={'Avatar'}
              user={user}
            />
            {/* Placeholder for profile picture */}

            <Text style={styles.name}>Hi</Text>
            <Text style={styles.bio}>Bio: </Text>
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
    flex: 1,
  },
  coverPhoto: {
    padding: 10,
    width: dimensions.width,
    height: 300,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    marginTop: -65,
    marginLeft: 20,
    borderColor: 'white',
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
