import React from 'react';
import {Text, View, StyleSheet, ScrollView} from "react-native";
import RectangleComponent from "../components/RectangleComponent";
import FormInputComponent from "../components/FormInputComponent";

function InitialInfoScreen(props) {
    return (
        <View style={styles.container}>
            <RectangleComponent/>
            <Text style={styles.text}>Please fill out the following information{'\n'}</Text>
            <Text style={styles.textLabel}>First Name</Text>

            <FormInputComponent placeholderText={"John"}/>
            <Text style={styles.textLabel}>Last Name</Text>
            <FormInputComponent placeholderText={"Doe"}/>

            <Text style={styles.textLabel}>Upload Image</Text>

        </View>
    );
}
const styles=StyleSheet.create({
    container: {
        alignItems: "center",

    },
    text: {
        fontSize: 15,
        padding: 10,
        fontWeight: "bold",
        color: "#070707"
    },
    textLabel: {
        right: '35%'
    }
})
export default InitialInfoScreen;
