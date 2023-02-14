import React from 'react'
import {TouchableOpacity,View,Text, StyleSheet} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function SocialButtonComponent(props){
    const {text,socialName,color,bgColor,onPress} = props
    return (
        <TouchableOpacity style={[styles.button, {backgroundColor: bgColor}]} onPress={onPress}>
            <View style={styles.iconWrapper}>
                <FontAwesome name={socialName} size={22} color={color} style={styles.icon}/>
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
        height: '10%',
        alignItems: "center",
        justifyContent: "center",
        flexDirection: 'row',
        padding: 10,
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
    },
})
