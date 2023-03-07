import React, {useEffect, useRef, useState} from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import SearchInputComponent from '../components/SearchInputComponent';
import RecentComponent from '../components/RecentComponent';
import {getAllUsers} from '../config/DB_Functions/DB_Functions';
import dimensions from '../config/DeviceSpecifications';
import {fetchUserData, getUserById} from '../config/DB_Functions/DB_Functions';
import {db, auth} from '../config/firebaseConfig';

function FeedScreen({navigation}) {
  const [user, setUser] = useState(null);
  const [userSet, setUserSet] = useState(false);
  const [recents, setRecents] = useState([]);
  const [emails, setEmails] = useState([]);
  const [searchedRecents, setSearchedRecents] = useState([]);
  const [searchText, setSearchText] = useState('');
  const recentsRef = useRef([]);
  const emailsRef = useRef([]);
  recentsRef.current = recents;
  emailsRef.current = emails;

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

        console.log('recents: ', userData.recents);
        console.log('recents: ', userData);

        // Iterate through the recents array and get the user data for each recent user
        for (let id in userData.recents) {
          getUserById(userData.recents[id])
            .then(a => {
              console.log('recendassts: ', a.userDoc.email);
              if (!emailsRef.current.includes(a.userDoc.email)) {
                setRecents([a.userDoc, ...recentsRef.current]);
                setEmails([...emailsRef.current, a.userDoc.email]);
              }
              console.log('list', recentsRef, emailsRef.current);
            })
            .catch(e => console.log('es2', e));
        }
      } else {
        console.log('No user data found');
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
