import React from 'react'
import {TouchableOpacity,View,Text, StyleSheet} from "react-native";

export default function FormButtonComponent(props){
    const {text,onPress} = props
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        marginTop: 10,
        width: '100%',
        height: '10%',
        backgroundColor: 'rgb(57,153,215)',
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white'
    },
})
