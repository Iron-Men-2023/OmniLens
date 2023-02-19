import React from 'react';
import {StyleSheet, View} from "react-native";
import dimensions from "../config/DeviceSpecifications"
function HorizontalLineComponent(props) {
    return (
        <View style={styles.container}>

        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        borderBottomColor: 'black',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderWidth: 4,
        width: dimensions.width*.9,
        borderRadius: 200
    },
})
export default HorizontalLineComponent;
