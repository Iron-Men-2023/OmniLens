import {createDrawerNavigator} from "react-navigation-drawer";
import {createAppContainer} from "react-navigation";
import HomeStack from "./HomeStack";
import SettingsStack from "./SettingsStack";
import OnboardingScreen from "../screens/OnboardingScreen";
import AuthScreen from "../screens/AuthScreen";
import LoginStack from "./LoginStack";

const drawerNavigator = createDrawerNavigator({

    Login: {
        screen: LoginStack
    },
    Home: {
        screen: HomeStack
    },
    Settings: {
        screen: SettingsStack
    }
})

export default createAppContainer(drawerNavigator);
