import React from 'react';
import {Button, Text, View} from "react-native";
import ProfileScreen from "./ProfileScreen";

function HomeScreen(props) {
    const {navigation} = props
    const pressHandler =() => {
        navigation.navigate('Profile');
        console.log(props)
    }

    return (
        <View>
            <Text>Home Screen</Text>
            <Button title="Profiles page" onPress={()=>pressHandler()}/>
        </View>
    );
}

export default HomeScreen;
