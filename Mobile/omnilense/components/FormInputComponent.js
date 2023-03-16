import React from 'react'
import {TextInput, StyleSheet, View, Text} from "react-native";
import {AntDesign} from "@expo/vector-icons";

export default function FormInputComponent(props){
    const {placeholderText,icon,changeText, ...rest} = props
    return (
        <View style={styles.inputContainer}>
            {icon?
            <View style={styles.iconStyle}>
                 <AntDesign name={icon} size={25} color='#666'/>
            </View>
                :null}
            <TextInput label="sadsa" placeholder={placeholderText} placeholderTextColor="#666" style={styles.input} onChangeText={text=> changeText(text)} {...rest}/>
        </View>
    )
}
const styles = StyleSheet.create({
    inputContainer: {
        marginTop: 5,
        marginBottom: 10,
        width: '90%',
        height: '10%',
        borderColor: '#ccc',
        borderRadius: 3,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    iconStyle: {
        padding: 10,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRightColor: '#ccc',
        borderRightWidth: 1,
        width: 50,
    },
    input: {
        padding: 10,
        flex: 1,
        fontSize: 16,
        color: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputField: {
        padding: 10,
        marginTop: 5,
        marginBottom: 10,
        width: '80vw',
        height: '8%',
        fontSize: 16,
        borderRadius: 8,
        borderWidth: 1,
    },
});