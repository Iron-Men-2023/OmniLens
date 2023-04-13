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
import {auth, firebaseApp} from '../config/firebaseConfig';
import FormInputComponent from '../components/FormInputComponent';
import FormButtonComponent from '../components/FormButtonComponent';
import SocialButtonComponent from '../components/SocialButtonComponent';
import {createUser, getUserById} from '../config/DB_Functions/DB_Functions';
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from 'expo-auth-session/providers/facebook';
import {expoClientId, iosClientId} from "../config";
import {GoogleAuthProvider} from "firebase/auth";

WebBrowser.maybeCompleteAuthSession();


function SignInScreen({navigation}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {theme} = useTheme();
    const {colors} = useTheme();
    const [token, setToken] = useState("");
    const [idToken, setIdToken] = useState("");
    const [userInfo, setUserInfo] = useState(null);


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

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: "GOOGLE_GUID.apps.googleusercontent.com",
        iosClientId: iosClientId,
        expoClientId: expoClientId,
        scopes: ["profile", "email"],

    });

    useEffect(() => {
        if (response?.type === "success") {
            setToken(response.authentication.accessToken);
            setIdToken(response.authentication.idToken);
            getUserInfo().then(r =>
                console.log("User info is: ", userInfo));
            firebaseSignInWithGoogle(response.authentication.idToken).then(r => console.log("Signed in with Google"));
        }
    }, [response, token]);

    const firebaseSignInWithGoogle = async (idToken) => {
        const credential = GoogleAuthProvider.credential(idToken);
        try {
            const userCredential = await auth.signInWithCredential(credential);
            const userExists = await getUserById(userCredential.user.uid);
            if (userExists !== null) {
                navigation.navigate('Home');
            } else {
                Alert.alert(
                    'Error',
                    'User does not exist in the database. Please sign up or continue sign up.',
                );
                navigation.navigate('Initial Info');
            }
        } catch (error) {
            console.error("Error signing in with Google:", error);
        }
    };

    const getUserInfo = async () => {
        try {
            const response = await fetch(
                "https://www.googleapis.com/userinfo/v2/me",
                {
                    headers: {Authorization: `Bearer ${token}`},
                }
            );

            const user = await response.json();
            console.log("User info1 is: ", user);
            setUserInfo(user);
        } catch (error) {
            // Add your own error handler here
            console.log(error);
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
                    onPress={() => promptAsync()}
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
    backPanel: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: -1,
    },
});

export default SignInScreen;
