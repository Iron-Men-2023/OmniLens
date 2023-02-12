import {createStackNavigator} from "react-navigation-stack";
import {createAppContainer} from "react-navigation";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
const screens ={
    Home:{
        screen: HomeScreen
    },
    Profile:{
        screen: ProfileScreen
    }
}
const HomeStack = createStackNavigator(screens)

export default createAppContainer(HomeStack)
