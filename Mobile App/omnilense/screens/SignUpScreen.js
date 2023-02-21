import React, {useEffect, useState} from 'react';
import {
  Image,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {auth} from '../config/firebaseConfig';
import FormInputComponent from '../components/FormInputComponent';
import {AntDesign} from '@expo/vector-icons';
import FormButtonComponent from '../components/FormButtonComponent';
import SocialButtonComponent from '../components/SocialButtonComponent';
import {createUser} from '../config/DB_Functions/DB_Functions';

function SignUpScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  function createAccount() {
    password === confirmPassword
      ? auth
          .createUserWithEmailAndPassword(email, password)
          .then(userCredential => {
            // Signed in
            const user = userCredential.user;
            createUser(user).then(r => {
              console.log('r', r);
            });
            // ...
            navigation.navigate('Initial Info');
          })
          .catch(error => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
            setErrorMessage(errorMessage);
          })
      : setErrorMessage("Password confirmation doesn't match");
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : (
          <Text style={styles.text}>Create an account</Text>
        )}

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
        />
        <FormInputComponent
          placeholderText="confirm password"
          icon="lock"
          secureTextEntry={true}
          changeText={setConfirmPassword}
        />

        <FormButtonComponent text="Sign up" onPress={createAccount} />
        <TouchableOpacity style={styles.forgotButton}>
          <Text style={styles.navButtonText}>Forgot Password?</Text>
        </TouchableOpacity>
        <SocialButtonComponent
          text="Sign up with Facebook"
          socialName="facebook"
          color="#4867aa"
          bgColor="#e6eaf4"
        />
        <SocialButtonComponent
          text="Sign up with Google"
          socialName="facebook"
          color="#de4d41"
          bgColor="#f5e7ea"
        />
        <TouchableOpacity
          style={styles.forgotButton}
          onPress={() => navigation.navigate('Sign In')}>
          <Text style={styles.navButtonText}>
            Already have an account? Sign in
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#b5c9fd',
    height: '100%',
  },
  errorText: {
    fontSize: 28,
    marginBottom: 10,
    color: '#fa0416',
  },
  logo: {
    height: 150,
    width: 150,
    resizeMode: 'cover',
  },
  text: {
    padding: 20,
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
