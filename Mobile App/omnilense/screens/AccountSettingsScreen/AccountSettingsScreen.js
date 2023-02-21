import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Button,
} from 'react-native';
import auth from '@react-native-firebase/auth';

const AccountSettings = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userDataSet, setUserDataSet] = useState(null);

  const user = auth().currentUser;

  const updateUsername = () => {
    setLoading(true);
    user
      .updateProfile({
        displayName: username,
      })
      .then(() => {
        setLoading(false);
        Alert.alert('Success', 'Username updated successfully');
      })
      .catch(error => {
        setLoading(false);
        Alert.alert('Error', error.message);
      });
  };

  const updateEmail = () => {
    setLoading(true);
    user
      .updateEmail(email)
      .then(() => {
        setLoading(false);
        Alert.alert('Success', 'Email updated successfully');
      })
      .catch(error => {
        setLoading(false);
        Alert.alert('Error', error.message);
      });
  };

  const updatePassword = () => {
    setLoading(true);
    user
      .updatePassword(password)
      .then(() => {
        setLoading(false);
        Alert.alert('Success', 'Password updated successfully');
      })
      .catch(error => {
        setLoading(false);
        Alert.alert('Error', error.message);
      });
  };

  useEffect(() => {
    setUserData(auth().currentUser);
    // fetchUserData().then(r => {
    //   setUserData(r.userDoc);
    //   console.log('userData', userData);
    //   setUserDataSet(true);
    // });
  }, []);

  return (
    <>
      {userData ? (
        <View style={styles.container}>
          <Text style={styles.text}>Username</Text>
          <TextInput
            style={styles.textInput}
            value={username}
            onChangeText={setUsername}
            placeholder={userData.displayName}
          />
          <Button
            title={'Update Username'}
            onPress={updateUsername}
            style={styles.button}
          />

          <Text style={styles.text}>Email</Text>
          <TextInput
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
            placeholder={userData.email}
          />
          <Button
            title={'Update Email'}
            onPress={updateEmail}
            style={styles.button}
          />

          <Text style={styles.text}>Password</Text>
          <TextInput
            style={styles.textInput}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
          />
          <Button
            title={'Update Password'}
            onPress={updatePassword}
            style={styles.button}
          />
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 20,
    color: '#333333',
    margin: 10,
  },
  textInput: {
    height: 40,
    width: 300,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    padding: 10,
  },
  button: {
    height: 40,
    width: 100,
    borderColor: 'black',
    borderWidth: 5,
    marginVertical: 10,
    alignItems: 'flex-start',
  },
});
export default AccountSettings;
