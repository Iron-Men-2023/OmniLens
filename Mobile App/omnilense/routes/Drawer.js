import {createDrawerNavigator} from "react-navigation-drawer";
import {createAppContainer} from "react-navigation";
import HomeStack from "./HomeStack";
import SettingsStack from "./SettingsStack";
import OnboardingScreen from "../screens/OnboardingScreen";

const drawerNavigator = createDrawerNavigator({
    Onboard: {
        screen: OnboardingScreen
    },
    Home: {
        screen: HomeStack
    },
    Settings: {
        screen: SettingsStack
    }
})

export default createAppContainer(drawerNavigator);
