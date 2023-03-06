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
      <TouchableOpacity style={styles.forgotButton}>
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
