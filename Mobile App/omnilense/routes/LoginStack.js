import {createStackNavigator} from "react-navigation-stack";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import HeaderComponent from "../components/HeaderComponent";
import React from "react";
import AuthScreen from "../screens/AuthScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import SignUpScreen from "../screens/SignUpScreen";
import InitialInfoScreen from "../screens/InitialInfoScreen";
const screens ={
    InitialInfo:{
        screen: InitialInfoScreen
    },
    Onboard: {
        screen: OnboardingScreen
    },
    Login:{
        screen: AuthScreen,

    },
    SignUp:{
        screen: SignUpScreen,
        navigationOptions: ({navigation}) => {
            return{
                headerTitle: () => <HeaderComponent navigation={navigation} title={"Sign Up"}/>,
                headerShown: true
            }
        }
    },

}
const LoginStack = createStackNavigator(screens,{
    defaultNavigationOptions:{
        headerShown: false
    }})

export default LoginStack
