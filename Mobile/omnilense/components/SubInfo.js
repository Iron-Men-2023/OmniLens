import React, {useEffect, useRef, useState} from "react"
import {View, Text, Image, TouchableOpacity} from "react-native"
import {getUserById} from "../config/DB_Functions/DB_Functions";

export const TimeDetails =() =>{
    return(
        <View style={{
            paddingHorizontal: 14,
            paddingVertical: 5,
            backgroundColor: "#175779",
            justifyContent: "center",
            alignItems: "center",
            elevation: 1,
            maxWidth: "50%",
            marginRight: -20,
            borderTopLeftRadius: 15
        }}>
            <Text style={{
                fontWeight: "bold",
                fontSize: 15,
                color: "#fff",
                justifyContent: "flex-end"
            }}>Seen:</Text>
            <Text style={{
                fontWeight: "bold",
                fontStyle: "italic",
                fontSize: 18,
                color: "#fff"
            }}>2 hours ago</Text>
        </View>
    )
}
export const DetailComponent = ({title}) => {
    return(
        <View>
            <Text style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#175779"
            }}>{title}</Text>

        </View>
    )
}
export const ImageComponent = ({src,index,onPressAction}) => {
    return(

            onPressAction ?
                <TouchableOpacity  onPress={onPressAction}>
                    <Image
                        source={{uri: src}}
                        resizeMode={"contain"}
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 40,
                            marginLeft: index===0? 0: -18,
                            borderColor: "#22262f",
                            borderWidth: 3
                        }}/>
                </TouchableOpacity>

                :
                <Image
                    source={{uri: src}}
                    resizeMode={"contain"}
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: 40,
                        marginLeft: index===0? 0: -18,
                        borderColor: "#22262f",
                        borderWidth: 3
                    }}/>


    )
}
export const Mutuals = ({loggedInUser,data,setConnected}) =>{
    const mutualsRef = useRef([]);
    const friendRef = useRef([]);
    const [firstRender, setFirstRender] = useState(true);

    setTimeout(()=>{
        setFirstRender(false)
    },200)
    useEffect(() => {
        data.friends?
            data.friends.forEach(friend => {
                if (loggedInUser.friends.includes(friend) && !friendRef.current.includes(friend)) {
                    getUserById(friend)
                        .then(a => {
                            mutualsRef.current.push(a.userDoc)
                            friendRef.current.push(friend)
                        })
                        .catch(e => console.log('es', e));
                }
            })

        : null

    })
    return(
    <View style={{
        flexDirection: "row"
    }}>
        {mutualsRef.current.map((mutual,index )=> (
            <ImageComponent src={mutual.avatarPhotoUrl ? mutual.avatarPhotoUrl: null} index={index}/>
        ))}
    </View>
    )
}
export const SubInfo= ({loggedInUser,data,setConnected}) =>{

    return(
        <View style={{
            width: "100%",
            paddingHorizontal: 20,
            marginTop: -55,
            flexDirection: "row",
            justifyContent: "space-between"
        }}>
            <Mutuals loggedInUser={loggedInUser} data={data} setConnected={setConnected}/>
            <TimeDetails/>
        </View>
    )
}

