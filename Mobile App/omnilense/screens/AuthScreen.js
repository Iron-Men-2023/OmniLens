import React, {useEffect, useState} from 'react';
import {
  Image,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {auth} from '../config/firebaseConfig';
import FormInputComponent from '../components/FormInputComponent';
import {AntDesign} from '@expo/vector-icons';
import FormButtonComponent from '../components/FormButtonComponent';
import SocialButtonComponent from '../components/SocialButtonComponent';
import {createUser} from '../config/DB_Functions/DB_Functions';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

function AuthScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        console.log('User is signed in');
        navigation.navigate('Home');
      } else {
        // User is signed out.
        console.log('User is signed out');
      }
    });

    // Clean-up function
    return unsubscribe;
  }, []);

  function signIn() {
    auth
      .signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        // Signed in
        console.log('Signed in');
        navigation.navigate('Home');
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        Alert.alert('Error', errorMessage);
        setPassword('');
      });
  }

  // async function signInWithGoogleAsync() {
  const [token, setToken] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      '743604615483-509kk3blq1rauaf9qpu3ir2clg80df8j.apps.googleusercontent.com',
    // androidClientId:
    //   '743604615483-509kk3blq1rauaf9qpu3ir2clg80df8j.apps.googleusercontent.com',
    // iosClientId:
    //   '743604615483-m38ne2mm2ijiqatbri6kq0o100pvjci4.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
  });

  useEffect(() => {
    if (response?.type === 'success') {
      setToken(response.authentication.accessToken);
      getUserInfo()
        .then(r => {
          console.log('r', r);
        })
        .catch(e => {
          console.log('e', e);
        });
    }
  }, [response, token]);

  const getUserInfo = async () => {
    try {
      const response = await fetch(
        'https://www.googleapis.com/userinfo/v2/me',
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );

      const user = await response.json();
      setUserInfo(user);
    } catch (error) {
      // Add your own error handler here
    }
  };

  function signInAnonymously() {
    auth
      .signInAnonymously()
      .then(userCredential => {
        console.log('Anonymous user signed in');
        navigation.navigate('Home');
      })
      .catch(error => {
        console.log(error);
        Alert.alert('Error', 'An error occurred while signing in anonymously.');
      });
  }

  function fbSignIn() {
    console.log('Facebook sign in');
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/Logo-removebg.png')}
        style={styles.logo}
      />
      <Text style={styles.text}>OmniLens</Text>
      <FormInputComponent
        placeholderText="email"
        icon="user"
        keyboardType="email-address"
        changeText={setEmail}
      />
      <FormInputComponent
        placeholderText="password"
        icon="lock"
        secureTextEntry={true}
        changeText={setPassword}
        onSubmitEditing={signIn}
      />
      <FormButtonComponent text="Sign in" onPress={signIn} />
      <TouchableOpacity
        style={styles.forgotButton}
        onPress={() => navigation.navigate('Forgot Password')}>
        <Text style={styles.navButtonText}>Forgot Password?</Text>
      </TouchableOpacity>
      <SocialButtonComponent
        text="Sign in with Facebook"
        socialName="facebook"
        color="#4867aa"
        bgColor="#e6eaf4"
        onPress={fbSignIn}
      />
      <SocialButtonComponent
        text="Sign in with Google"
        socialName="google"
        color="#de4d41"
        bgColor="#f5e7ea"
        disabled={!request}
        onPress={() => {
          promptAsync()
            .then(r => console.log('r', r))
            .catch(e => console.log('e', e));
        }}
      />
      <SocialButtonComponent
        text="Sign in anonymously"
        socialName="user-secret"
        color="#000"
        bgColor="#e6eaf4"
        onPress={signInAnonymously}
      />
      <TouchableOpacity
        style={styles.forgotButton}
        onPress={() => navigation.navigate('Sign Up')}>
        <Text style={styles.navButtonText}>Create account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#b5c9fd',
    flex: 1,
    padding: 20,
  },
  logo: {
    height: 150,
    width: 150,
    resizeMode: 'cover',
  },
  text: {
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
  },
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    marginVertical: 20,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: 'rgb(57,153,215)',
  },
});

export default AuthScreen;
