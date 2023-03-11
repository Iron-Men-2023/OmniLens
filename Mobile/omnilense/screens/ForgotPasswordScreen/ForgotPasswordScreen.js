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
import FormInputComponent from '../../components/FormInputComponent';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import FormButtonComponent from '../../components/FormButtonComponent';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(57,153,215)',
    secondary: '#f1c40f',
  },
};

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
  };

  const onSignInPress = () => {
    navigation.navigate('Sign In');
  };

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <Image
          source={require('../../assets/Logo-removebg.png')}
          style={styles.logo}
        />
        <Text style={styles.text}>OmniLens</Text>

        <FormInputComponent
          placeholderText="Email"
          icon="mail"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          onSubmitEditing={onSignInPress}
        />

        <FormButtonComponent text="Send" onPress={onSendPressed} />
        <FormButtonComponent text="Sign In" onPress={onSignInPress} />
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
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
  forgotButton: {
    marginVertical: 20,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: 'rgb(57,153,215)',
  },
});

export default ForgotPasswordScreen;
