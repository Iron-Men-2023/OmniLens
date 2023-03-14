import React, {useEffect, useRef, useState} from "react"
import {View, Text, Image} from "react-native"
import {getUserById} from "../config/DB_Functions/DB_Functions";

export const ImageComponent = ({src,index}) => {
    return(
        <Image
            source={{uri: src}}
            resizeMode={"contain"}
            style={{
                width: 48,
                height: 48,
                borderRadius: 40,
                marginLeft: index===0? 0: -18
            }}
        />
    )
}
export const Mutuals = ({loggedInUser,data}) =>{
    const [render, Rerender] = useState(true);
    const mutualsRef = useRef([]);
    const friendRef = useRef([]);
    useEffect(() => {
        data.friends?
            data.friends.forEach(friend => {
                if (loggedInUser.friends.includes(friend) && !friendRef.current.includes(friend)) {
                    getUserById(friend)
                        .then(a => {
                            mutualsRef.current.push(a.userDoc)
                            friendRef.current.push( friend)
                        })
                        .catch(e => console.log('e2s', e));
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
export const SubInfo= ({loggedInUser,data}) =>{

    return(
        <View style={{
            width: "100%",
            paddingHorizontal: 20,
            marginTop: -55,
            flexDirection: "row",
            justifyContent: "space-between"
        }}>

            <Mutuals loggedInUser={loggedInUser} data={data}/>
        </View>
    )
}

