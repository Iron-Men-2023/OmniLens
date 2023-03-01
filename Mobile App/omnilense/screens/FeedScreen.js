import React, {useEffect, useRef, useState} from 'react';
import {Text, View, StyleSheet, ScrollView} from "react-native";
import SearchInputComponent from "../components/SearchInputComponent";
import RecentComponent from "../components/RecentComponent";
import {getAllUsers} from "../config/DB_Functions/DB_Functions"
import dimensions from "../config/DeviceSpecifications"
import {fetchUserData,getUserById} from "../config/DB_Functions/DB_Functions"
function FeedScreen({navigation}) {
    const [user, setUser] = useState(null);
    const [userSet, setUserSet] = useState(false);
    const [recents, setRecents] = useState([])
    const [emails, setEmails] = useState([])
    const [searchedRecents, setSearchedRecents] = useState([])
    const [searchText, setSearchText] = useState("")
    const recentsRef =useRef([])
    const emailsRef = useRef([])
    recentsRef.current =recents
    emailsRef.current = emails

    function dynamicSearch(text){
        setSearchText(text)
        setSearchedRecents(recents.filter(element => element.name.includes(text)));
        console.log(searchedRecents,"asdadsadasdas")
    }
    useEffect(() => {
        fetchUserData()
            .then(r => {
                //console.log('user data: ', r.userDoc);
                setUser(r.userDoc);
                setUserSet(true);
                for (let id in user.recents) {
                    getUserById(user.recents[id])
                        .then(a => {
                            console.log('recendassts: ', a.userDoc.email);
                            if(!emailsRef.current.includes(a.userDoc.email))
                            {
                                setRecents([a.userDoc,...recentsRef.current])
                               // recentsRef.current = recents
                                setEmails([...emailsRef.current,a.userDoc.email])
                               // emailsRef
                            }
                            console.log("listts",recentsRef,emailsRef.current)
                            }
                        )
                }
            })
            .catch(e => console.log('es1', e));
    }, [userSet]);

    return (
        <View style={styles.container}>
            <SearchInputComponent changeText={dynamicSearch}/>
            <ScrollView style={styles.scroll}>
                {   searchedRecents.length === 0?
                    recents.map(user => (
                        <RecentComponent
                            avatar={user.avatarPhotoUrl}
                            name={user.name}
                            navigation={navigation}
                            id={user.uid}
                        />
                    ))
                    :
                    searchedRecents.map(user => (
                    <RecentComponent
                        avatar={user.avatarPhotoUrl}
                        name={user.name}
                        navigation={navigation}
                        id={user.uid}
                    />
                ))}

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        backgroundColor: "#fff"
    },
    scroll: {
        marginBottom: dimensions.height*.15
    }
})

export default FeedScreen;
