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
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'rgb(57,153,215)',
        secondary: '#f1c40f',
    },
};

function SignUpScreen({navigation}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);

    function createAccount() {
        if (password === confirmPassword) {
            auth
                .createUserWithEmailAndPassword(email, password)
                .then(userCredential => {
                    // ...
                    navigation.navigate('Initial Info');
                })
                .catch(error => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // ..
                    setErrorMessage(errorMessage);
                });
        } else {
            setErrorMessage("Password confirmation doesn't match");
        }
    }

    return (
        <PaperProvider theme={theme}>
            {errorMessage ? (
                <Text style={{color: 'red', textAlign: 'center'}}>{errorMessage}</Text>
            ) : null}
            <View style={styles.container}>
                <Image
                    source={require('../assets/Logo-removebg.png')}
                    style={styles.logo}
                />
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

                <FormButtonComponent text="Sign up" onPress={createAccount}/>
                <SocialButtonComponent
                    text="Sign up with Facebook"
                    socialName="facebook"
                    color="#4867aa"
                    bgColor="#e6eaf4"
                    onPress={() => alert('Facebook button pressed')}
                />
                <SocialButtonComponent
                    text="Sign up with Google"
                    socialName="facebook"
                    color="#de4d41"
                    bgColor="#f5e7ea"
                    onPress={() => alert('Google button pressed')}
                />
                <TouchableOpacity
                    style={styles.forgotButton}
                    onPress={() => navigation.navigate('Sign In')}>
                    <Text style={styles.navButtonText}>
                        Already have an account? Sign in
                    </Text>
                </TouchableOpacity>
            </View>
        </PaperProvider>
    );
}

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

export default SignUpScreen;
