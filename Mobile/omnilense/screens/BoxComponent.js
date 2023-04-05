import React, {useEffect, useRef, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View, Pressable, TextInput} from "react-native";
import dimensions from "../config/DeviceSpecifications";
import {purple} from "@mui/material/colors";
import {getUserById} from "../config/DB_Functions/DB_Functions";

function BoxComponent({title, userData, screen, navigation}) {
    console.log('userData HERE: ', userData);
    return (
        <View>
            <Text style={styles.title}>{title}</Text>
            {userData ? (
                <TouchableOpacity style={styles.container}
                                  onPress={() => navigation.navigate(screen, {userData: userData})}>
                    <Image style={styles.image} source={{uri: userData.avatarPhotoUrl}}/>
                </TouchableOpacity>
            ) : null}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        margin: 10,
        borderColor: "#000000",
        borderWidth: 4,
        color: "#fff",
        height: dimensions.height * .25,
        width: dimensions.width * .45,
    },
    title: {
        marginLeft: dimensions.width * .12,
        fontWeight: '600',
        fontStyle: "italic",
        color: "#4c00ab"
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 5,

    }
})
export default BoxComponent;
