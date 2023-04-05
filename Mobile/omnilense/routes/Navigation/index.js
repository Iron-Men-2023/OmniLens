import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Alert} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {createStackNavigator} from '@react-navigation/stack';
import AuthScreen from '../../screens/SignInScreen';
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
import FeedScreen from '../../screens/FeedScreen';
import InitialInfoScreen from '../../screens/InitialInfoScreen';
import InterestsScreen from '../../screens/InterestsScreen';
import {getAllUsersData, logout} from '../../config/DB_Functions/DB_Functions';
import {auth, db} from '../../config/firebaseConfig';
import ViewOtherUser from '../../screens/ViewUserProfileScreen';
import FriendsScreen from '../../screens/FriendsScreen';
import FriendRequestsScreen from '../../screens/FriendRequestsScreen';
import MLScreen from '../../screens/MLScreen';
import AccountSettingsScreen from '../../screens/AccountSettingsScreen';
import RecentsScreen from "../../screens/RecentsScreen";
import ViewUserFriendsScreen from "../../screens/ViewUserFriendsScreen";
import Feed from "../../screens/Feed";

import {
    Provider,
    MD3LightTheme,
    adaptNavigationTheme,
} from 'react-native-paper';
import ForgotPasswordScreen from '../../screens/ForgotPasswordScreen';
import {Platform} from 'react-native';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import ChatScreen from "../../screens/MessagingScreen";
import ChatsScreen from "../../screens/ChatsScreen";
import MessagingScreen from "../../screens/MessagingScreen";

const Tab = createBottomTabNavigator();
const SIZE = 30;
const focusColor = '#3b84a6';
const restColor = '#341062';

function HomeTabs() {
    return (
        <Tab.Navigator screenOptions={{showLabel: false}}>
            <Tab.Screen
                name={'Feed'}
                component={Feed}
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

async function sendNotification(title, body) {
    // Get the token from the user in firebase
    let token = await db
        .collection('users')
        .doc(auth.currentUser.uid)
        .get()
        .then(doc => {
            return doc.data().token;
        });
    if (!token) {
        console.log('No token found');
        return;
    }
    let message = {
        to: token,
        sound: 'default',
        title: title,
        body: body,
        data: {data: 'goes here'},
        ios: {
            _displayInForeground: true,
        },
        android: {
            channelId: 'default',
        },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
            host: 'exp.host',
            'accept-encoding': 'gzip, deflate',
            'accept-language': 'en-US,en;q=0.9',
        },
        body: JSON.stringify(message),
    });
}

TaskManager.defineTask('sendNotification', async ({data, error}) => {
    if (error) {
        console.log('TaskManager Error:', error);
        return;
    }
    if (data && data.type === 'newFriendRequest') {
        const {friendRequests} = data;
        const lastFriendRequest = friendRequests[friendRequests.length - 1];
        if (lastFriendRequest) {
            await sendNotification(
                'New Friend Request',
                `${lastFriendRequest.name} wants to be your friend!`,
            );
        }
    }
});

function DrawerNavigator() {
    useEffect(() => {
        const currentUser = auth.currentUser;
        const unsubscribe = db
            .collection('users')
            .doc(currentUser.uid)
            .onSnapshot(async doc => {
                const data = doc.data();
                const friendRequestsData = data.friendRequests;
                console.log('Friends', friendRequestsData);
                try {
                    const friendData = await getAllUsersData(friendRequestsData);
                    console.log('Friend Data', friendData);
                    // Get the lst friend request
                    const lastFriendRequest = friendData[friendData.length - 1];
                    console.log('Last Friend Request in update', lastFriendRequest);
                    if (lastFriendRequest) {
                        await TaskManager.getRegisteredTasksAsync().then(tasks => {
                            console.log('Tasks', tasks);
                            if (tasks.length === 0) {
                                Notifications.scheduleNotificationAsync({
                                    content: {
                                        title: 'New Friend Request',
                                        body: `${lastFriendRequest.name} wants to be your friend!`,
                                    },
                                    trigger: null,
                                });
                            }
                        });
                    }
                } catch (error) {
                    console.log(error);
                }
            });
        return () => unsubscribe();
    }, []);
    return (
        <Drawer.Navigator
            initialRouteName={'Home'}
            useLegacyImplementation
            drawerContent={props => <SignOutComponent {...props} />}>
            <Drawer.Screen name={APPNAME} component={HomeTabs}/>
            <Drawer.Screen name="Friends" component={FriendsScreen}/>
            <Drawer.Screen name="Friend Requests" component={FriendRequestsScreen}/>
            <Stack.Screen name={'Chats'} component={ChatsScreen}/>
            <Drawer.Screen
                name="Account Settings"
                component={AccountSettingsScreen}
            />
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
const {LightTheme} = adaptNavigationTheme({reactNavigationLight: false});
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

        <Provider theme={MD3LightTheme}>
            <NavigationContainer theme={LightTheme}>
                <Stack.Navigator screenOptions={{headerShown: false}}>
                    {user ? (
                        <Stack.Screen name="Home" component={DrawerNavigator}/>
                    ) : null}
                    {user ? (
                        <Stack.Screen name={'Recents'} component={RecentsScreen}
                                      options={{title: "Viewed By", headerShown: true}}/>
                    ) : null}
                    {user ? (
                        <Stack.Screen name={'OtherUserProfile'} component={ViewOtherUser}/>
                    ) : null}
                    {user ? (
                        <Stack.Screen name={'OtherUserFriends'} component={ViewUserFriendsScreen}
                                      options={{title: "Friends", headerShown: true}}/>
                    ) : null}
                    {user ? (
                        <Stack.Screen name={'Messages'} component={MessagingScreen}/>
                    ) : null}
                    <Stack.Screen name={'Onboarding'} component={OnboardingScreen}/>
                    <Stack.Screen
                        name="Sign In"
                        component={AuthScreen}
                        initialParams={{data: 'signIn'}}
                    />
                    <Stack.Screen name="Sign Up" component={SignUpScreen}/>
                    <Stack.Screen name={'Initial Info'} component={InitialInfoScreen}/>
                    <Stack.Screen name={'Interests'} component={InterestsScreen}/>

                    <Stack.Screen
                        name={'Forgot Password'}
                        component={ForgotPasswordScreen}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
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
