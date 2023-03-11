import React, {useEffect, useRef, useState} from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import SearchInputComponent from '../components/SearchInputComponent';
import RecentComponent from '../components/RecentComponent';
import {getAllUsers} from '../config/DB_Functions/DB_Functions';
import dimensions from '../config/DeviceSpecifications';
import {fetchUserData, getUserById} from '../config/DB_Functions/DB_Functions';
import {db, auth} from '../config/firebaseConfig';
import * as Notifications from 'expo-notifications';
import {Platform} from 'react-native';

function FeedScreen({navigation}) {
  const [user, setUser] = useState(null);
  const [userSet, setUserSet] = useState(false);
  const [recents, setRecents] = useState([]);
  const [emails, setEmails] = useState([]);
  const [searchedRecents, setSearchedRecents] = useState([]);
  const [searchText, setSearchText] = useState('');
  const recentsRef = useRef([]);
  const emailsRef = useRef([]);
  const [token, setToken] = useState(null);
  recentsRef.current = recents;
  emailsRef.current = emails;

  // Request permission to send notifications
  async function registerForPushNotificationsAsync() {
    let token;
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    // Check if the user has granted permission
    const {status: existingStatus} = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      // If the user hasn't granted permission, ask for it
      const {status} = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }

    // Get the user's push token
    token = (await Notifications.getExpoPushTokenAsync()).data;
    setToken(token);
    await db.collection('users').doc(auth.currentUser.uid).update({
      token: token,
    });
  }

  // Register for push notifications when the component mounts
  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(r => console.log('Registered for push notifications'))
      .catch(e => console.log('Error registering for push notifications', e));
  }, []);

  function dynamicSearch(text) {
    setSearchText(text);
    setSearchedRecents(recents.filter(element => element.name.includes(text)));
  }

  useEffect(() => {
    // Get the current user's doc reference
    const userDocRef = db.collection('users').doc(auth.currentUser.uid);

    // Get the current user's data and listen for changes to their recents field
    const unsubscribe = userDocRef.onSnapshot(doc => {
      if (doc.exists) {
        const userData = doc.data();
        setUser(userData);
        setUserSet(true);

        // Iterate through the recents array and get the user data for each recent user
        for (let id in userData.recents) {
          getUserById(userData.recents[id])
            .then(a => {
              if (!emailsRef.current.includes(a.userDoc.email)) {
                setRecents([a.userDoc, ...recentsRef.current]);
                setEmails([...emailsRef.current, a.userDoc.email]);
              }
            })
            .catch(e => console.log('es2', e));
        }
      }
    });

    // Unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, [userSet]);

  return (
    <View style={styles.container}>
      <SearchInputComponent changeText={dynamicSearch} />
      <ScrollView style={styles.scroll}>
        {userSet ? (
          <>
            {searchedRecents.length === 0
              ? recents.map(user => (
                  <View key={user.uid}>
                    <RecentComponent
                      avatar={user.avatarPhotoUrl}
                      name={user.name}
                      navigation={navigation}
                      id={user.uid}
                      user={user}
                    />
                  </View>
                ))
              : searchedRecents.map(user => (
                  <View key={user.uid}>
                    <RecentComponent
                      avatar={user.avatarPhotoUrl}
                      name={user.name}
                      navigation={navigation}
                      id={user.uid}
                    />
                  </View>
                ))}
          </>
        ) : (
          <Text>Loading...</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  scroll: {
    marginBottom: dimensions.height * 0.15,
  },
});

export default FeedScreen;
