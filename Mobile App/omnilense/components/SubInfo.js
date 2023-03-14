import React, {useEffect, useRef, useState} from "react"
import {View, Text, Image} from "react-native"
import {getUserById} from "../config/DB_Functions/DB_Functions";

export const ImageComponent = ({src,count}) => {
    console.log("IDX",count)
    return(
        <Image
            source={{uri: src}}
            resizeMode={"contain"}
            style={{
                width: 48,
                height: 48,
                borderRadius: 40,
                marginLeft: count===0? 0: -18
            }}
        />
    )
}
export const Mutuals = ({loggedInUser,data}) =>{
    const [mutuals,setMutuals] = useState([])
    const [emails, setEmails] = useState([]);
    const mutualsRef = useRef([]);
    const emailsRef = useRef([]);

    useEffect(() => {

    loggedInUser.friends.forEach(friend =>{

        getUserById(friend)
            .then(a => {

                if(a.userDoc.recents.includes(data.uid) && !emailsRef.current.includes(a.userDoc.email)){
                     setMutuals([...mutualsRef.current,a.userDoc])
                     setEmails([...emailsRef.current,a.userDoc.email])
                    console.log(a.userDoc.name,"Has ssee",data.name)
                }
            })
            .catch(e => console.log('es2', e));
    })
    })
    return(
    <View style={{
        flexDirection: "row"
    }}>
        {mutualsRef.current.map((mutual,index) => (
            <ImageComponent src={mutual.avatarPhotoUrl ? mutual.avatarPhotoUrl: null} count={index}/>
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

