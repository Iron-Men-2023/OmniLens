import React, {useEffect, useState} from "react"
import {View,Text,Image} from "react-native"
import logo from "../assets/Logo-removebg.png"
import {ImageComponent} from "./SubInfo";
import {fetchUserData} from "../config/DB_Functions/DB_Functions";
import SearchInputComponent from "./SearchInputComponent";
const Header= ({user,search,navigation}) =>{

    return(
        <View style={{
            backgroundColor: '#001F2D',
            padding: 14
        }}>
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <View style={{flexDirection: "row"}}>
                <Image source={logo} style={{height: 40,width: 40}}/>
                <Text style={{color: "white",fontSize:18,fontWeight:"bold", marginTop: 7}}>OmniLens</Text>
                </View>
                <View style={{
                    width:45,
                    height:45
                }}>
                    <ImageComponent src={user.avatarPhotoUrl} index={0} onPressAction={()=>navigation.navigate("Profile")}/>
                </View>
            </View>
            <View style={{marginVertical: 20}}>
                <Text style={{fontSize: 14, color: "white"}}> Hello, {user.name} 👋🏼</Text>
                <Text style={{fontSize: 18, color: "white", fontWeight: "bold"}}>Search through your recents</Text>
            </View>
            <View style={{marginTop: 5}}>
                <SearchInputComponent changeText={search}/>
            </View>
        </View>
    )
}

export default Header
