import React from "react";
import {Text, View,StyleSheet} from "react-native";
import {MaterialIcons} from "@expo/vector-icons"

function HeaderComponent({navigation,title,showDrawer}) {

    return(
        <View style={styles.header}>
            {showDrawer? <MaterialIcons name="menu" size={28} style={styles.icon} onPress={()=>navigation.openDrawer()}/>: null}
            <View>
                <Text style={styles.headerText}>{title}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: '100%',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    headerText: {
        fontWeight: "bold",
        fontSize: 20,
        color: "#333",
        letterSpacing: 1,
        marginRight: '20%'
    },
    icon: {
        position: "absolute",
        left: 10
    }
})
export default HeaderComponent


