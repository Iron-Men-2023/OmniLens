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
import {fetchUserData, getUserById} from '../../config/DB_Functions/DB_Functions';
import ProfilePhotoComponent from '../../components/ProfilePhotoComponent';
import dimensions from '../../config/DeviceSpecifications';
import FriendRequestsScreen from '../FriendRequestsScreen';
import BoxComponent from "../BoxComponent";
import InterestComponent from "../../components/InterestComponent";
import { Chip } from 'react-native-paper';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [userSet, setUserSet] = useState(false);
  const [userData, setUserData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [friendId, setFriendId] = useState(null)
  const [friend, setFriend] = useState(null);
  useEffect(() => {
    fetchUserData()
      .then(r => {
        setUser(r.userDoc);
        setUserSet(true);
        //get friend image for friend list display
        setFriendId(r.userDoc.friends[user.friends.length-1])

        getUserById(friendId)
            .then(r => {
              setFriend(r.userDoc);
            })
            .catch(e => console.log('e1', e));
      })
      .catch(e => console.log('e1', e));
  }, [userSet]);

  const onRefresh = async () => {
    setRefreshing(true);
    fetchUserData()
      .then(r => {
        try {
          setUserData(r.userDoc);
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

            <Text style={styles.name}>{user.name}</Text>
            <ScrollView style={styles.scroll} horizontal={true}>
              {user.interests.map(interest => (
                  <View style={styles.chip}>
                    <Chip icon={"heart"} onPress={() => console.log('Pressed')}>{interest}</Chip>
                  </View>
              ))}
            </ScrollView>

          </View>
          <View style={styles.header2}>
            <Text style={styles.bio}>Bio: {user.bio}</Text>
          </View>
          <View style={styles.box}>
            <BoxComponent title={user.friends.length+" Friends" } friend={friend.avatarPhotoUrl}/>
            <BoxComponent title={"New viewers"} friend={friend.avatarPhotoUrl}/>
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
  },
  row: {
    flexDirection: "row"
  },
  header: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    borderBottomWidth: 20,
    borderBottomColor: 'lightgray',
    paddingBottom: 10,
    flex: 1,
  },
  header2: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    borderBottomWidth: 2,
    borderBottomColor: 'lightgray',
    paddingBottom: 10,
    flex: 1,
  },
  coverPhoto: {
    padding: 10,
    width: dimensions.width,
    height: 225,
  },
  avatar: {
    width: 185,
    height: 185,
    borderRadius: 150,
    borderWidth: 4,
    marginTop: -125,
    marginLeft: -165,
    borderColor: 'white',
  },
  name: {
    fontSize: 22,
    color: '#000000',
    fontWeight: '600',
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
  chip: {
    padding: 4,
    marginTop: 10
  },
  box: {
    flexDirection: "row",
    alignItems: "stretch"
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
