import React, {useRef, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View,Pressable} from "react-native";
import dimensions from "../config/DeviceSpecifications";

//()=>Linking.openURL('https://www.instagram.com/rstarkid73/')
function BoxComponent({title}) {

    return(
        <View>
            <Text style={styles.title}>{title}</Text>

            <View style={styles.container}>

            </View>

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
        height: dimensions.height*.25,
        width: dimensions.width*.45,
    },
    title: {
        marginLeft: dimensions.width*.12,
        fontWeight: '600',
        fontSize: 22,
        borderBottomColor: 'lightgray',
        borderBottomWidth: 2,
    }
})
export default BoxComponent;
