import React from 'react';
import {TextInput, View,StyleSheet} from "react-native";
import { EvilIcons } from '@expo/vector-icons';

function SearchInputComponent({changeText}) {
    return (
        <View style={styles.container}>
            <EvilIcons name="search" size={24} color="black" />
            <TextInput placeholder="search" style={styles.input} onChangeText={text=> changeText(text)}/>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 5,
        marginBottom: 15,

        borderColor: '#ccc',
        borderRadius: 20,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    input: {
        padding: 10,
        flex: 1,
        fontSize: 16,
        color: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#ccc',
        borderRadius: 20,
        borderWidth: 1,
    },
})

export default SearchInputComponent;
