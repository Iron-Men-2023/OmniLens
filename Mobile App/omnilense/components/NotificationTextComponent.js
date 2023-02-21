import React from 'react';
import {StyleSheet, Text, View} from "react-native";
import dimensions from "../config/DeviceSpecifications";
import {AntDesign} from "@expo/vector-icons";

function NotificationTextComponent({text,icon}) {
    return (
        <View style={styles.container}>
            <AntDesign name={icon} size={20} color='white' style={styles.icon}/>
            <Text style={styles.text}>{text}</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: "#2d2c2c",
        borderWidth: 1,
        borderRadius: 10
    },
    text: {
        color: "white",
        fontWeight: "bold",
        marginLeft: 10
    },

})
export default NotificationTextComponent;
