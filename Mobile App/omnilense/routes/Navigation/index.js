import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Alert} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {createStackNavigator} from '@react-navigation/stack';
import AuthScreen from '../../screens/AuthScreen';
import SignUpScreen from '../../screens/SignUpScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SearchScreen from '../../screens/SearchScreen';
import ProfileScreen from '../../screens/ProfileScreen';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import OnboardingScreen from '../../screens/OnboardingScreen';
import {getAuth, getAdditionalUserInfo, signOut} from 'firebase/auth';
import HomeScreen from '../../screens/HomeScreen';
import FeedScreen from '../../screens/FeedScreen';
import InitialInfoScreen from '../../screens/InitialInfoScreen';
import InterestsScreen from '../../screens/InterestsScreen';
import {logout} from '../../config/DB_Functions/DB_Functions';
import {auth} from '../../config/firebaseConfig';
import FriendsScreen from '../../screens/FriendsScreen';
import FriendRequestsScreen from '../../screens/FriendRequestsScreen';
import MLScreen from '../../screens/MLScreen';
import ViewOtherUser from "../../screens/ViewUserProfileScreen";
import FriendsScreen from '../../screens/FriendsScreen';
import FriendRequestsScreen from '../../screens/FriendRequestsScreen';
import MLScreen from '../../screens/MLScreen';

const Tab = createBottomTabNavigator();
const SIZE = 30;
const focusColor = 'red';
const restColor = 'blue';

function HomeTabs() {
  return (
    <Tab.Navigator screenOptions={{showLabel: false}}>
      <Tab.Screen
        name={'Feed'}
        component={FeedScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View>
              <Icon
                name={'book'}
                size={SIZE}
                color={focused ? focusColor : restColor}
              />
            </View>
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="ML Model"
        component={MLScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View>
              <Icon
                name={'magic'}
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
    <Drawer.Navigator
      initialRouteName={'Home'}
      useLegacyImplementation
      drawerContent={props => <SignOutComponent {...props} />}>
      <Drawer.Screen name={APPNAME} component={HomeTabs} />
      <Drawer.Screen name="Friends" component={FriendsScreen} />
      <Drawer.Screen name="Friend Requests" component={FriendRequestsScreen} />

      {/*<Drawer.Screen*/}
      {/*  name="Account Settings"*/}
      {/*  component={AccountSettingsScreen}*/}
      {/*/>*/}
    </Drawer.Navigator>
  );
}

function SignOutComponent(props) {
  return (
    <DrawerContentScrollView>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Sign Out"
        onPress={() =>
          Alert.alert(
            'Log out',
            'Do you want to logout?',
            [
              {
                text: 'Cancel',
                onPress: () => {
                  return null;
                },
              },
              {
                text: 'Confirm',
                onPress: async () => {
                  try {
                    await logout().catch(error => {
                      console.log(error);
                    });
                  } catch (error) {
                    console.error(error);
                    console.log('signOut error');
                  }
                  props.navigation.navigate('Sign In');
                },
              },
            ],
            {cancelable: false},
          )
        }
      />
    </DrawerContentScrollView>
  );
}

const Stack = createStackNavigator();

export default function Navigation() {
  const [user, setUser] = useState();
  const [isUserSet, setIsUserSet] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUser(user);
        setIsUserSet(true);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [isUserSet]);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {user ? <Stack.Screen name="Home" component={DrawerNavigator} /> : null}
        <Stack.Screen name={'Onboarding'} component={OnboardingScreen} />
        <Stack.Screen
          name="Sign In"
          component={AuthScreen}
          initialParams={{data: 'signIn'}}
        />
        <Stack.Screen name="Sign Up" component={SignUpScreen} />
        <Stack.Screen name={'Initial Info'} component={InitialInfoScreen} />
        <Stack.Screen name={'Interests'} component={InterestsScreen} />
        <Stack.Screen name={'OtherUserProfile'} component={ViewOtherUser} />
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
