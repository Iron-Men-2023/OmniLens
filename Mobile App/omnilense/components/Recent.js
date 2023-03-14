import React, {useState} from "react"
import {View, Text, StyleSheet, Image, TouchableOpacity} from "react-native"
import {useNavigation} from "@react-navigation/native";
import dimensions from "../config/DeviceSpecifications";
import {AntDesign} from "@expo/vector-icons";
import {SubInfo} from "./SubInfo";

const Recent= ({data,loggedInUser}) =>{
    const navigation = useNavigation()
    const [connected, setConnected] = useState(false)
    console.log(data)
    const IconSizes = 30;

    return(
        <View style={styles.container}>
            <View style={styles.imageView}>
                <Image source={{uri: data.avatarPhotoUrl}} resizeMode={"cover"} style={{width: "100%", height: "90%",borderTopLeftRadius: 14,borderTopRightRadius: 14}}/>
                <TouchableOpacity onPress={()=>setConnected(!connected)} style={{top: 10,right:10,position:"absolute"}}>
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
            </View>
            <SubInfo loggedInUser={loggedInUser} data={data}/>
        </View>
    )

}
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        marginBottom: 24,
        margin: 8,
        borderRadius: 14

    },
    imageView: {
        height: dimensions.height*.4,
        width: "100%",
    }

});
export default Recent
