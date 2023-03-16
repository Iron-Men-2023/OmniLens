import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  Linking,
} from 'react-native';
import {
  fetchUserData,
  getUserById,
} from '../../config/DB_Functions/DB_Functions';
import ProfilePhotoComponent from '../../components/ProfilePhotoComponent';
import dimensions from '../../config/DeviceSpecifications';
import FriendRequestsScreen from '../FriendRequestsScreen';
import BoxComponent from '../BoxComponent';
import InterestComponent from '../../components/InterestComponent';
import {Chip,Button} from 'react-native-paper';
import igLogo from '../../assets/iglogo.jpg';
import fbLogo from '../../assets/fblogo.jpg';
import twitterLogo from '../../assets/twitter.jpg';

const ProfilePage = ({navigation}) => {
  const [user, setUser] = useState(null);
  const [userSet, setUserSet] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [friend, setFriend] = useState(null);
  useEffect(() => {
    fetchUserData()
      .then(r => {

        setUser(r.userDoc);
        setUserSet(true);
        //get friend image for friend list display
        if (user.friends) {
          getUserById(r.userDoc.friends[user.friends.length - 1])
            .then(r => {
              setFriend(r.userDoc);
            })
            .catch(e => console.log('easds1', e));
        } else {
          setFriend(null);
        }
      })
      .catch(e => console.log('e4', e));
  }, [userSet]);

  const onRefresh = async () => {
    setRefreshing(true);
    setUserSet(false);
    await fetchUserData()
      .then(r => {
        try {

          setUser(r.userDoc);
          setUserSet(true);
          setUserSet(true);

          if (user.friends) {
            //get friend image for friend list display
            getUserById(r.userDoc.friends[user.friends.length - 1])
              .then(r => {
                setFriend(r.userDoc);
              })
              .catch(e => console.log('easds1', e));
          } else {
            setFriend(null);
          }
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
            <View style={styles.row}>
              <ProfilePhotoComponent
                  imageStyle={styles.avatar}
                  photoType={'Avatar'}
                  user={user}
              />
              <View style={styles.icon}>
                <Button icon="pencil-plus-outline"  onPress={()=>console.log("asdas")} labelStyle={{fontSize: 50}}>
                </Button>
              </View>

            </View>

            {/* Placeholder for profile picture */}
            <View style={styles.profileText}>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.bio}>Bio: {user.bio}</Text>
            </View>

            <ScrollView style={styles.scroll} horizontal={true}>
              {user.interests.map(interest => (
                <View style={styles.chip} key={interest}>
                  <Chip icon={'heart'}>
                    {interest}
                  </Chip>
                </View>
              ))}
            </ScrollView>
          </View>
          <View style={styles.header2}>
          </View>
          <View style={styles.box}>
            {friend ? (
              <BoxComponent
                title={user.friends.length + ' Friends'}
                friend={friend.avatarPhotoUrl}
                navigation={navigation}
                screen={"Friends"}
                currentUser={user.uid}

              />
            ) : (
              <BoxComponent title={user.friends.length + ' Friends'} navigation={navigation}
                            screen={"Friends"} />

            )}
            {friend ? (
              <BoxComponent
                title={'New viewers'}
                friend={friend.avatarPhotoUrl}
                navigation={navigation}
                screen={"Recents"}
                currentUser={user.uid}
              />
            ) : (
              <BoxComponent title={'New viewers'} navigation={navigation}
                            screen={"Recents"}/>
            )}
          </View>
          <Text style={styles.title}>Socials:</Text>

          <View style={styles.socials}>
            <TouchableOpacity
              style={styles.socialImageBtn}
              onPress={() =>
                Linking.openURL(
                  'https://www.instagram.com/' + user.instagram + '/',
                )
              }>
              <Image source={fbLogo} style={styles.socialImage} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialImageBtn}
              onPress={() =>
                Linking.openURL(
                  'https://www.instagram.com/' + user.instagram + '/',
                )
              }>
              <Image source={igLogo} style={styles.socialImage} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialImageBtn}
              onPress={() =>
                Linking.openURL('https://twitter.com/' + user.twitter)
              }>
              <Image source={twitterLogo} style={styles.socialImage} />
            </TouchableOpacity>
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
  icon: {
      marginLeft: 100,
      marginTop: -10,
  },
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',

  },
  socials: {
    flexDirection: 'row',
  },
  profileText: {
    marginTop: -30
  },
  socialImageBtn: {},
  header: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    borderBottomWidth: 40,
    borderBottomColor: 'lightgrey',
    paddingBottom: 10,
    flex: 1,
  },
  header2: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    borderBottomWidth: 5,
    borderBottomColor: '#9a6cd9',
    paddingBottom: 10,
    flex: 1,
  },
  coverPhoto: {
    padding: 10,
    width: dimensions.width,
    height: 200,
  },
  avatar: {
    width: 170,
    height: 170,
    borderRadius: 150,
    borderWidth: 4,
    marginTop: -115,
    marginLeft: 10,
    borderColor: 'white',
  },
  name: {
    fontSize: 22,
    color: '#000000',
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  title: {
    fontSize: 22,
    color: '#000000',
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginTop: 10,
  },
  bio: {
    fontSize: 16,
    color: '#696969',
    marginTop: 10,
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginLeft: 10,

  },
  socialImage: {
    width: 80,
    height: 80,
    margin: 20,
    borderRadius: 10,
  },
  chip: {
    padding: 4,
    marginTop: 10,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderBottomWidth: 5,
    borderBottomColor: '#9a6cd9',
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
