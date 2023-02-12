import {createDrawerNavigator} from "react-navigation-drawer";
import {createAppContainer} from "react-navigation";
import HomeStack from "./HomeStack";
import SettingsStack from "./SettingsStack";

const drawerNavigator = createDrawerNavigator({
    Home: {
        screen: HomeStack
    },
    Settings: {
        screen: SettingsStack
    }
})

export default createAppContainer(drawerNavigator);
