import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import auth from '@react-native-firebase/auth';

function AuthScreen() {
    // Set an initializing state whilst Firebase connects
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();

    // Handle user state changes
    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        return auth().onAuthStateChanged(onAuthStateChanged); // unsubscribe on unmount
    }, []);

    if (initializing) return null;

    if (!user) {
        return (
            <View>
                <Text>Login</Text>
            </View>
        );
    }

    return (
        <View>
            <Text>Welcome {user.email}</Text>
        </View>
    );
}
export default AuthScreen
