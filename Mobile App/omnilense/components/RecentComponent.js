import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import dimensions from "../config/DeviceSpecifications"
import HorizontalLineComponent from "./HorizontalLineComponent";
import {AntDesign, Entypo, Feather} from "@expo/vector-icons";
function RecentComponent(props) {
    const IconSizes = 30
    return (
        <View>
            <View style={styles.container}>

                <View style={styles.line}>
                    <HorizontalLineComponent/>
                </View>
                <View style={styles.icons}>
                    <TouchableOpacity>
                        <AntDesign name="pluscircleo" size={IconSizes} color='black' style={styles.icon}/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Feather name="bookmark" size={IconSizes} color='black' style={styles.icon}/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Feather name="message-circle" size={IconSizes} color="black" style={styles.icon}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text}>Joslin Some</Text>
            </View>
            <Text>{"\n"}</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        borderRadius: 60,
        padding: 10,
        margin: 10,
        borderColor: "#000000",
        borderWidth: 4,
        color: "#fff",
        height: dimensions.height*.32,
        width: dimensions.width*.9,
        alignItems: "center"
    },
    line: {
        marginTop: dimensions.height*.23,
    },
    icons: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 0
    },
    icon: {
        margin: 10
    },
    text: {
        fontWeight: "bold",
        fontStyle: "italic",
        fontSize: 15,
    },
    textContainer: {
        alignItems: "center",
        marginLeft: dimensions.width*.45
    }
})
export default RecentComponent;
