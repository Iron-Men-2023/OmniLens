import {createStackNavigator} from "react-navigation-stack";
import SettingsScreen from "../screens/SettingsScreen";
import HeaderComponent from "../components/HeaderComponent";

const screens ={
    Settings:{
        screen: SettingsScreen,
        navigationOptions: ({navigation}) => {
            return{
                headerTitle: () => <HeaderComponent navigation={navigation}/>
            }
        }
    },
}
const SettingsStack = createStackNavigator(screens)

export default SettingsStack
