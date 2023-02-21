import React, {useEffect, useState} from 'react';
import { StyleSheet, View, Text, Alert } from "react-native";
import {NavigationContainer} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
//
//
const Tab = createBottomTabNavigator();
const SIZE = 30;
const focusColor = 'red';
const restColor = 'blue';
function HomeTabs() {
  return (
    <Tab.Navigator screenOptions={{showLabel: false}}>
      <Tab.Screen
        name="Feed"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View>
              <Icon
                name={'home'}
                size={SIZE}
                color={focused ? focusColor : restColor}
              />
            </View>
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View>
              <Icon
                name={'search'}
                size={SIZE}
                color={focused ? focusColor : restColor}
              />
            </View>
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View>
              <Icon
                name={'user'}
                size={SIZE}
                color={focused ? focusColor : restColor}
              />
            </View>
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

const APPNAME = 'OmniLense';
const Drawer = createDrawerNavigator();
function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name={APPNAME} component={HomeTabs} />
      {/*<Drawer.Screen*/}
      {/*  name="Account Settings"*/}
      {/*  component={AccountSettingsScreen}*/}
      {/*/>*/}
    </Drawer.Navigator>
  );
}

// function SignOutComponent(props) {
//   return (
//       <DrawerNavigator>
//       <DrawerItemList {...props} />
//       <DrawerItem
//         label="Sign Out"
//         onPress={() =>
//           Alert.alert(
//             'Log out',
//             'Do you want to logout?',
//             [
//               {
//                 text: 'Cancel',
//                 onPress: () => {
//                   return null;
//                 },
//               },
//               {
//                 text: 'Confirm',
//                 onPress: async () => {
//                   try {
//                     // await auth().signOut();
//                     console.log('signOut success');
//                   } catch (error) {
//                     console.error(error);
//                     console.log('signOut error');
//                   }
//                   props.navigation.navigate('Sign In');
//                 },
//               },
//             ],
//             {cancelable: false},
//           )
//         }
//       />
// </DrawerNavigator>
//   );
// }

// const Stack = createStackNavigator();
// const Navigation = () => {
//   // const signOutUser = useUserStore(state => state.signOutUser);
//   //
//   const [user, setUser] = useState();
//
//   useEffect(() => {
//     const unsubscribe = auth().onAuthStateChanged(user => {
//       if (user) {
//         setUser(user);
//       } else {
//         setUser(null);
//       }
//     });
//
//     return () => unsubscribe();
//   }, []);
//
//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{headerShown: false}}>
//         {user ? <Stack.Screen name="Home" component={DrawerNavigator} /> : null}
//         <Stack.Screen
//           name="Sign In"
//           component={AuthScreen}
//           initialParams={{data: 'signIn'}}
//         />
//         <Stack.Screen name="Sign Up" component={SignUpScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// const LoginStackScreens = createStackNavigator({
//   Onboard: {
//     screen: OnboardingScreen
//   },
//   InitialInfo:{
//     screen: InitialInfoScreen,
//     navigationOptions: ({navigation}) => {
//     }
//   },
//   Interests: {
//     screen: InterestsScreen,
//     navigationOptions: ({navigation}) => {
//     }
//   },
//
//   Login:{
//     screen: AuthScreen,
//
//   },
//   SignUp:{
//     screen: SignUpScreen,
//   },
//
// }
// );
// const Navigation = createAppContainer(LoginStackScreens);
import { createStackNavigator } from '@react-navigation/stack';
import AuthScreen from "../../screens/AuthScreen";
import SignUpScreen from "../../screens/SignUpScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SearchScreen from "../../screens/SearchScreen";
import ProfileScreen from "../../screens/ProfileScreen";
import { createDrawerNavigator, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import auth from "../../config/firebaseConfig"
import OnboardingScreen from "../../screens/OnboardingScreen";


const Stack = createStackNavigator();

export default function Navigation() {
  const [user, setUser] = useState();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [setUser]);
  return (
    // <Navigation/>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {user ? <Stack.Screen name="Home" component={DrawerNavigator} /> : null}
        <Stack.Screen name={"Onboarding"} component={OnboardingScreen} />
        <Stack.Screen
          name="Sign In"
          component={AuthScreen}
          initialParams={{data: 'signIn'}}
        />
        <Stack.Screen name="Sign Up" component={SignUpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
// export default Navigation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
