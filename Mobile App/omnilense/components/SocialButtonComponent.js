import React from 'react'
import {TouchableOpacity,View,Text, StyleSheet} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function FormButtonComponent(props){
    const {text,socialName,color,bgColor} = props
    return (
        <TouchableOpacity style={[styles.button,{backgroundColor: bgColor}]}>
            <View style={styles.iconWrapper}>
                <FontAwesome btn={socialName} size={22} color={color} style={styles.icon}/>
            </View>
            <View style={styles.btnTxtWrapper}>
                <Text style={[styles.buttonText,{color: color}]}>{text}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        marginTop: 10,
        width: '100%',
        height: '10vh',
        backgroundColor: "blue",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5
    },
    iconWrapper: {
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        fontWeight: 'bold',
    },
    btnTxtWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Lato-Regular',
    },
})
