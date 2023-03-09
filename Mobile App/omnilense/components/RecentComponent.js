import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Pressable,
  Alert,
} from 'react-native';
import dimensions from '../config/DeviceSpecifications';
import HorizontalLineComponent from './HorizontalLineComponent';
import {AntDesign, Feather, Ionicons} from '@expo/vector-icons';
import NotificationTextComponent from './NotificationTextComponent';
import {sendFriendRequest} from '../config/DB_Functions/DB_Functions';
import {auth} from '../config/firebaseConfig';

function RecentComponent({name, avatar, navigation, id, user}) {
  const IconSizes = 30;
  const [connected, setConnected] = useState(
    user.friends && user.friends.includes(auth.currentUser.uid),
  );
  const [connectionNofification, setConnectionNofification] = useState(false);
  const [saveNotification, setSaveNotification] = useState(false);
  const [saved, setSaved] = useState(false);
  const urlRef = useRef('');
  urlRef.current = avatar;

  async function displayImage() {
    urlRef.current = await avatar.getDownloadURL();
    console.log('THHH', urlRef.current);
  }

  async function handleCheckPress() {
    if (!connected) {
      const friendCode = await sendFriendRequest(user);
      if (friendCode === 1) {
        Alert.alert('You are already friends');
      } else if (friendCode === 2) {
        Alert.alert('You have already sent a request');
      }
      setConnected(true);

      setConnectionNofification(true);

      setTimeout(() => {
        setConnectionNofification(false);
      }, 1500);
    } else {
      Alert.alert('Already connected');
    }
  }

  function handleBookmarkPress() {
    setSaved(!saved);
    if (!saved) {
      setSaveNotification(true);
      setTimeout(() => {
        setSaveNotification(false);
      }, 1500);
    }
  }

  useEffect(() => {
    // Check if the user is already friends or have sent a request
    if (
      (user.friends && user.friends.includes(auth.currentUser.uid)) ||
      (user.friendRequests &&
        user.friendRequests.includes(auth.currentUser.uid))
    ) {
      setConnected(true);
    }
  }, []);

  return (
    <View>
      <Pressable
        style={({pressed}) => [
          {backgroundColor: pressed ? 'black' : 'white'},
          styles.container,
        ]}
        onPress={() => navigation.navigate('OtherUserProfile', {uid: id})}>
        <Image style={styles.image} source={{uri: avatar}} />
      </Pressable>
      <View style={styles.pos}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{name}</Text>
        </View>
        <View style={styles.icons}>
          <TouchableOpacity onPress={handleCheckPress}>
            {connected ? (
              <AntDesign
                name="checkcircleo"
                size={IconSizes}
                color="black"
                style={styles.icon}
              />
            ) : (
              <AntDesign
                name="pluscircleo"
                size={IconSizes}
                color="black"
                style={styles.icon}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleBookmarkPress}>
            {saved ? (
              <Ionicons
                name="bookmark"
                size={IconSizes}
                color="#ff2121"
                style={styles.icon}
              />
            ) : (
              <Feather
                name="bookmark"
                size={IconSizes}
                color="black"
                style={styles.icon}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather
              name="message-circle"
              size={IconSizes}
              color="black"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.center}>
        {connectionNofification ? (
          <NotificationTextComponent
            text="Connection request sent"
            icon={'pluscircle'}
          />
        ) : null}
        {saveNotification ? (
          <NotificationTextComponent text="Profile saved" icon={'pluscircle'} />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 60,
    padding: 2,
    margin: 10,
    borderColor: '#000000',
    borderWidth: 4,
    color: '#fff',
    height: dimensions.height * 0.55,
    width: dimensions.width * 0.95,
    alignItems: 'center',
  },
  line: {
    marginTop: dimensions.height * 0.23,
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 0,
  },
  icon: {
    marginLeft: 20,
  },
  text: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: 18,
  },
  textContainer: {
    alignItems: 'center',
    marginLeft: dimensions.width * 0.13,
  },
  center: {
    alignItems: 'center',
  },
  pos: {
    flexDirection: 'row',
    marginBottom: dimensions.height * 0.05,
  },
  image: {
    width: '98%',
    height: '98%',
    borderRadius: 60,
    padding: 10,
  },
});
export default RecentComponent;
