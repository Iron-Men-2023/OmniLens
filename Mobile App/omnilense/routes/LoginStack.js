import {createStackNavigator} from "react-navigation-stack";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import HeaderComponent from "../components/HeaderComponent";
import React from "react";
import AuthScreen from "../screens/AuthScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import SignUpScreen from "../screens/SignUpScreen";
const screens ={
    Onboard: {
        screen: OnboardingScreen
    },
    Login:{
        screen: AuthScreen,

    },
    SignUp:{
        screen: SignUpScreen,
    }
}
const LoginStack = createStackNavigator(screens,{
    defaultNavigationOptions:{
        headerShown: false
    }})

export default LoginStack
