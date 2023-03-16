import React from 'react';
import {StyleSheet,View,Text} from "react-native";


function RectangleComponent(props) {

    return (
        <View style={styles.container}>
            <Text style={styles.text}>👋 Welcome to OmniLens</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#8c38ee",
        height:  '15%',
        width: '96%',
        borderRadius: 5,
        marginTop: '10%',
        alignItems: "center",
        justifyContent: "center"
    },
    text: {
        fontSize: 20,
        color: "#fff",
        fontWeight: "bold",
        fontStyle: "italic"

    },

})
export default RectangleComponent;
