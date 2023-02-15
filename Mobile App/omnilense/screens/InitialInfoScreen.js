import React, {useState} from 'react';
import {Text, View, StyleSheet, ScrollView} from "react-native";
import RectangleComponent from "../components/RectangleComponent";
import FormInputComponent from "../components/FormInputComponent";
import ImagePickerComponent from "../components/ImagePickerComponent";
import TextButtonComponent from "../components/TextButtonComponent";
import dimensions from "../config/DeviceSpecifications"
function InitialInfoScreen({navigation}) {
    const [uploaded, setUploaded] = useState(false)
    return (
        <View style={styles.container}>
            <RectangleComponent/>
            <Text style={styles.text}>Please fill out the following information{'\n'}</Text>
            <Text style={styles.textLabel}>First Name</Text>

            <FormInputComponent placeholderText={"John"}/>
            <Text style={styles.textLabel}>Last Name</Text>
            <FormInputComponent placeholderText={"Doe"}/>

            <Text>{"\n"}</Text>
            <Text>{"\n"}</Text>
            <ImagePickerComponent setUploaded={setUploaded}/>
            {
                uploaded ?
                    <View style={styles.next}>
                        <TextButtonComponent text="Next" onPress={() => navigation.navigate("Interests")}/>
                    </View>
                    : null
            }
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
        right: dimensions.width*.35
    },
    next: {
        marginLeft: dimensions.width*0.7,
        marginTop: dimensions.height* 0.05
    }
})
export default InitialInfoScreen;
