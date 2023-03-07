import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Button,
} from 'react-native';
import {auth} from '../../config/firebaseConfig';
import {logout} from '../../config/DB_Functions/DB_Functions';

const AccountSettings = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userDataSet, setUserDataSet] = useState(null);
  const [confirmChange, setConfirmChange] = useState(false);

  const user = auth.currentUser;

  const updateUsername = () => {
    setLoading(true);
    user
      .updateProfile({
        username: username,
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
    if (password.length < 6 || password !== confirmPassword) {
      Alert.alert(
        'Error',
        'Passwords do not match or are not 6 characters long',
      );
      return;
    }

    if (!confirmChange) {
      Alert.alert(
        'Confirm Password Change',
        'Are you sure you want to change your password?',
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              setConfirmChange(true);
              setLoading(true);
              user
                .updatePassword(password)
                .then(async () => {
                  setLoading(false);
                  setConfirmChange(false);
                  setPassword('');
                  setConfirmPassword('');
                  await logout()
                    .then(() => {
                      navigator.navigate('Sign In');
                    })
                    .catch(error => {
                      Alert.alert('Error', error.message);
                    });
                })
                .catch(error => {
                  setLoading(false);
                  Alert.alert('Error', error.message);
                });
            },
          },
        ],
        {cancelable: false},
      );
    }
  };

  useEffect(() => {
    setUserData(auth.currentUser);
    setUserDataSet(true);
  }, [userDataSet]);

  return (
    <>
      {userData ? (
        <View style={styles.container}>
          <Text style={styles.text}>Username</Text>
          <TextInput
            style={styles.textInput}
            value={username}
            onChangeText={setUsername}
            placeholder={userData.username}
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
          <TextInput
            style={styles.textInput}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
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
