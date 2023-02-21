import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import dimensions from "../config/DeviceSpecifications"
import HorizontalLineComponent from "./HorizontalLineComponent";
import {AntDesign, Entypo, Feather, FontAwesome5, Ionicons} from "@expo/vector-icons";
import NotificationTextComponent from "./NotificationTextComponent";
function RecentComponent(props) {
    const IconSizes = 30
    const [connected, setConnected] = useState(false);
    const [connectionNofification, setConnectionNofification] = useState(false);
    const [saveNotification, setSaveNotification] = useState(false)
    const [saved, setSaved] = useState(false);
    function handleCheckPress(){
        setConnected(!connected)
        if(!connected){
            setConnectionNofification(true)

            setTimeout(()=>{
                setConnectionNofification(false)
            },1500)
        }
    }
    function handleBookmarkPress(){
        setSaved(!saved)
        if(!saved){
            setSaveNotification(true)
            setTimeout(()=>{
                setSaveNotification(false)
            },1500)
        }
    }
    return (
        <View>
            <View style={styles.pos}>
            <View style={styles.container}>
                <View style={styles.line}>
                    <HorizontalLineComponent/>
                </View>
                <View style={styles.icons}>
                    <TouchableOpacity onPress={handleCheckPress} >
                        {
                            connected?
                                <AntDesign name="checkcircleo" size={IconSizes} color='black' style={styles.icon}/>
                            :   <AntDesign name="pluscircleo" size={IconSizes} color='black' style={styles.icon}/>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleBookmarkPress}>
                        {
                            saved?
                                <Ionicons name="bookmark" size={IconSizes} color="#ff2121" style={styles.icon}/>
                            :   <Feather name="bookmark" size={IconSizes} color="black" style={styles.icon}/>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Feather name="message-circle" size={IconSizes} color="black" style={styles.icon}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text}>Joslin Some</Text>
            </View>

            </View>
            <View style={styles.center}>
                {
                    connectionNofification?
                        <NotificationTextComponent text="Connection request sent" icon={"pluscircle"}/>
                    : null
                }
                {
                    saveNotification?
                        <NotificationTextComponent text="Profile saved" icon={"pluscircle"}/>
                        :null
                }
            </View>

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
    },
    center: {
        alignItems: "center",
    },
    pos: {
        position: "relative"
    }
})
export default RecentComponent;
