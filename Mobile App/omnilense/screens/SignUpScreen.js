import React, {useEffect, useState} from 'react';
import {Image, Text, View, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';
import FormInputComponent from "../components/FormInputComponent";
import {AntDesign} from "@expo/vector-icons";
import FormButtonComponent from "../components/FormButtonComponent";
import SocialButtonComponent from "../components/SocialButtonComponent";

function SignUpScreen({navigation}) {
    return (
        <View style={styles.container}>

            <Text style={styles.text}>Create an account</Text>
            <FormInputComponent placeholderText="email" icon="user" keyboardType="email-address"/>
            <FormInputComponent placeholderText="password" icon="lock" secureTextEntry={true}/>
            <FormInputComponent placeholderText="confirm password" icon="lock" secureTextEntry={true}/>

            <FormButtonComponent text="Sign up"/>
            <TouchableOpacity style={styles.forgotButton}>
                <Text style={styles.navButtonText}>Forgot Password?</Text>
            </TouchableOpacity>
            <SocialButtonComponent text="Sign up with Facebook"
                                   socialName="facebook" color="#4867aa"
                                   bgColor="#e6eaf4"/>
            <SocialButtonComponent text="Sign up with Google"
                                   socialName="facebook" color="#de4d41"
                                   bgColor="#f5e7ea"/>
            <TouchableOpacity style={styles.forgotButton} onPress={()=>navigation.navigate("Login")}>
                <Text style={styles.navButtonText}>Already have an account? Sign in</Text>
            </TouchableOpacity>
        </View>
    );
}
export default SignUpScreen

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        paddingTop: 10,
        backgroundColor: '#b5c9fd',
        height: '100%'
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
