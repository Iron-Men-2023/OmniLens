import React, {useEffect, useState} from 'react';
import {Image, Text, View, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';
import FormInputComponent from "../components/FormInputComponent";
import {AntDesign} from "@expo/vector-icons";
import FormButtonComponent from "../components/FormButtonComponent";
import SocialButtonComponent from "../components/SocialButtonComponent";

function AuthScreen() {
    return (
        <View style={styles.container}>
            <Image
                source={require("../assets/Logo.png")}
                style={styles.logo}/>
            <Text style={styles.text}>OmniLens</Text>
            <FormInputComponent placeholderText="email" icon="user" keyboardType="email-address"/>
            <FormInputComponent placeholderText="password" icon="lock" secureTextEntry={true}/>
            <FormButtonComponent text="Sign in"/>
            <TouchableOpacity style={styles.forgotButton}>
                <Text style={styles.navButtonText}>Forgot Password?</Text>
            </TouchableOpacity>
            <SocialButtonComponent text="Sign in with Facebook"
                                   socialName="facebook" color="#4867aa"
                                   bgColor="#e6eaf4"/>
            <SocialButtonComponent text="Sign in with Google"
                                   socialName="facebook" color="#de4d41"
                                   bgColor="#f5e7ea"/>
            <TouchableOpacity style={styles.forgotButton}>
                <Text style={styles.navButtonText}>Create account</Text>
            </TouchableOpacity>
        </View>
    );
}
export default AuthScreen

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        paddingTop: 10
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
