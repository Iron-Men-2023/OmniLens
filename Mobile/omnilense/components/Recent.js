import React, {useEffect, useRef, useState} from "react"
import {View, Text, StyleSheet, Image, TouchableOpacity, Alert, Pressable} from "react-native"
import {useNavigation} from "@react-navigation/native";
import dimensions from "../config/DeviceSpecifications";
import {AntDesign, Feather, Ionicons} from "@expo/vector-icons";
import {DetailComponent, SubInfo} from "./SubInfo";
import {sendFriendRequest} from "../config/DB_Functions/DB_Functions";
import NotificationTextComponent from "./NotificationTextComponent";
import {auth} from "../config/firebaseConfig";

const Recent= ({data,loggedInUser,navigation}) =>{
    const [connected, setConnected] = useState(data.friends && data.friends.includes(auth.currentUser.uid),
    )
    const [saved, setSaved] = useState(false);
    const [connectionNofification, setConnectionNofification] = useState(false);
    const [saveNotification, setSaveNotification] = useState(false);
    const IconSizes = 30;
    const [detailColor,setDetailColor] =useState("#fff")

    function handleRecentComponentPress(){
        navigation.navigate('OtherUserProfile', {uid: data.uid})
    }
    function handleBookmarkPress() {
        setSaved(!saved);
        if (!saved) {
            setSaveNotification(true);
            Alert.alert("Account Saved");

            setTimeout(() => {
                setSaveNotification(false);
            }, 1500);
        }
    }
    async function handleCheckPress() {
        if (!connected) {
            const friendCode = await sendFriendRequest(user);
            if (friendCode === 1) {
                Alert.alert('You are already friends');
            } else if (friendCode === 2) {
                Alert.alert('You have already sent a request');
            }
            setConnected(true);

            setConnectionNofification(true);

            setTimeout(() => {
                setConnectionNofification(false);
            }, 1500);
        } else {
            Alert.alert('Already connected');
        }
    }
    return(
        <View style={styles.container}>
            <Pressable
                style={({pressed}) => [
                    {backgroundColor: pressed ? 'black' : 'white'},
                ]}
                onPressIn={()=>setDetailColor("#283441")}
                onPressOut={()=>setDetailColor("white")}
                onPress={handleRecentComponentPress}>

            <View style={styles.imageView}>
                <Image source={{uri: data.avatarPhotoUrl}} resizeMode={"cover"} style={{width: "100%", height: "90%",borderTopLeftRadius: 14,borderTopRightRadius: 14}}/>
            </View>
            <SubInfo loggedInUser={loggedInUser} data={data} setConnected={setConnected}/>
            <View style={{
                width: "100%",
                padding: 20,
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: detailColor
            }}>
                <DetailComponent
                    title={data.name}
                />
                <View style={styles.icons}>
                    <TouchableOpacity onPress={handleCheckPress}>
                        {connected ? (
                            <AntDesign
                                name="checkcircleo"
                                size={IconSizes}
                                color="black"
                                style={styles.icon}
                            />
                        ) : (
                            <AntDesign
                                name="pluscircleo"
                                size={IconSizes}
                                color="black"
                                style={styles.icon}
                            />
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleBookmarkPress}>
                        {saved ? (
                            <Ionicons
                                name="bookmark"
                                size={IconSizes}
                                color="#ff2121"
                                style={styles.icon}
                            />
                        ) : (
                            <Feather
                                name="bookmark"
                                size={IconSizes}
                                color="black"
                                style={styles.icon}
                            />
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Feather
                            name="message-circle"
                            size={IconSizes}
                            color="black"
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            </Pressable>

            <View style={styles.center}>
                {connectionNofification ? (
                    <NotificationTextComponent
                        text="Connection request sent"
                        icon={'pluscircle'}
                    />
                ) : null}
            </View>
        </View>
    )

}
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        marginBottom: 24,
        margin: 14,

    },
    center: {
        alignItems: 'center',
    },
    imageView: {
        height: dimensions.height*.4,
        width: "100%",
    },
    icons: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 0,
    },
});
export default Recent
