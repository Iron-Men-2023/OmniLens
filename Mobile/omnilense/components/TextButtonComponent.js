import React from 'react';
import {Text, TouchableOpacity, View,StyleSheet} from "react-native";

function TextButtonComponent({text,onPress}) {
    return (
        <View>
            <TouchableOpacity onPress={onPress}>
                <Text style={styles.navButtonText}>{text}</Text>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    navButtonText: {
        fontSize: 18,
        fontWeight: '500',
        color: 'rgb(57,153,215)',
    },
})
export default TextButtonComponent;
