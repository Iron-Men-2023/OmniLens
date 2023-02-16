import {createStackNavigator} from "react-navigation-stack";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import HeaderComponent from "../components/HeaderComponent";
import React from "react";
const screens ={
    Home:{
        screen: HomeScreen,
        navigationOptions: ({navigation}) => {
            return{
                headerTitle: () => <HeaderComponent navigation={navigation} showDrawer={true} title={"OmniLens"}/>
            }
        }
    },
    Profile:{
        screen: ProfileScreen,

    }
}
const HomeStack = createStackNavigator(screens,{
    defaultNavigationOptions:{
        headerTitle: 'OmniLens',
    }})

export default HomeStack
