import React, {useEffect, useState} from 'react';
import {
    Image,
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {useTheme, Provider as PaperProvider} from 'react-native-paper';
import {auth} from '../config/firebaseConfig';
import FormInputComponent from '../components/FormInputComponent';
import FormButtonComponent from '../components/FormButtonComponent';
import SocialButtonComponent from '../components/SocialButtonComponent';
import {createUser, getUserById} from '../config/DB_Functions/DB_Functions';
import * as Google from 'expo-auth-session/providers/google';

function SignInScreen({navigation}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {theme} = useTheme();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                navigation.navigate('Home');
            } else {
                console.log('User is signed out');
            }
        });

        return unsubscribe;
    }, []);

    const signIn = () => {
        auth
            .signInWithEmailAndPassword(email, password)
            .then(async userCredential => {
                // Check if user exists in the firestore database
                const userExists = await getUserById(userCredential.user.uid);
                console.log("User exists: " + userExists);
                if (userExists !== null) {
                    navigation.navigate('Home');
                } else {
                    Alert.alert(
                        'Error',
                        'User does not exist in the database. Please sign up or continue sign up.',
                    );
                    navigation.navigate('Initial Info');
                }
            })
            .catch(error => {
                const errorCode = error.code;
                const errorMessage = error.message;
                Alert.alert('Error', errorMessage);
                setPassword('');
            });
    };

    const signInWithGoogleAsync = async () => {
        try {
            const result = Google.useAuthRequest({
                expoClientId: '',
                iosClientId: '',
                androidClientId: '',
                scopes: ['profile', 'email'],
            });

            if (result.type === 'success') {
                const credential = auth.GoogleAuthProvider.credential(
                    result.idToken,
                    result.accessToken,
                );
                await auth.signInWithCredential(credential);
            } else {
                console.log('Google sign-in was cancelled.');
            }
        } catch (e) {
            console.log('Error with Google sign-in:', e);
        }
    };

    const fbSignIn = () => {
        console.log('Facebook sign in');
    };

    return (
        <PaperProvider theme={theme}>
            <View style={styles.container}>
                <Image
                    source={require('../assets/Logo-removebg.png')}
                    style={styles.logo}
                />
                <Text style={styles.text}>OmniLens</Text>

                <FormInputComponent
                    placeholderText="Email"
                    icon="mail"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    onSubmitEditing={signIn}
                />

                <FormInputComponent
                    placeholderText="Password"
                    icon="lock"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    onSubmitEditing={signIn}
                />

                <FormButtonComponent text="Sign in" onPress={signIn}/>

                <TouchableOpacity
                    style={styles.forgotButton}
                    onPress={() => navigation.navigate('Forgot Password')}>
                    <Text style={styles.navButtonText}>Forgot Password?</Text>
                </TouchableOpacity>

                <SocialButtonComponent
                    text="Sign in with Google"
                    socialName="google"
                    color="#de5246"
                    bgColor="#f5e7ea"
                    onPress={signInWithGoogleAsync}
                />
                <TouchableOpacity
                    style={styles.forgotButton}
                    onPress={() => navigation.navigate('Sign Up')}>
                    <Text style={styles.navButtonText}>
                        Don't have an account? Create here
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

export default SignInScreen;
