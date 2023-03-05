import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import {auth} from '../../config/firebaseConfig';
import FormButtonComponent from '../../components/FormButtonComponent';
import FormInputComponent from '../../components/FormInputComponent';

const ForgotPasswordScreen = ({navigation}) => {
  const [email, setEmail] = useState('');

  const onSendPressed = () => {
    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        console.log('Password reset email sent!');
      })
      .catch(error => {
        console.log(error);
      });
    navigation.navigate('Sign In');
  };

  const onSignInPress = () => {
    navigation.navigate('Sign In');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/Logo-removebg.png')}
        style={styles.logo}
      />
      <Text style={styles.text}>OmniLens</Text>
      <Text style={styles.title}>Reset your password</Text>

      <FormInputComponent
        placeholderText="email"
        icon="user"
        keyboardType="email-address"
        changeText={setEmail}
      />
      <FormButtonComponent text="Send" onPress={onSendPressed} />
      <FormButtonComponent text="Sign In" onPress={onSignInPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#b5c9fd',
    flex: 1,
    padding: 20,
  },
  logo: {
    marginTop: 50,
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
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: 'rgb(57,153,215)',
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    color: '#051d5f',
  },
});

export default ForgotPasswordScreen;
