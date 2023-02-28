import React, {useEffect, useRef, useState} from 'react';
import {Text, View, StyleSheet, ScrollView} from "react-native";
import SearchInputComponent from "../components/SearchInputComponent";
import RecentComponent from "../components/RecentComponent";
import {getAllUsers} from "../config/DB_Functions/DB_Functions"
import dimensions from "../config/DeviceSpecifications"
import {fetchUserData,getUserById} from "../config/DB_Functions/DB_Functions"
function FeedScreen(props) {
    const [user, setUser] = useState(null);
    const [userSet, setUserSet] = useState(false);
    const [recents, setRecents] = useState([])
    const [emails, setEmails] = useState([])
    const recentsRef =useRef([])
    const emailsRef = useRef([])
    recentsRef.current =recents
    emailsRef.current = emails
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
                            console.log("listt",recentsRef,emailsRef.current)
                            }
                        )
                }
            })
            .catch(e => console.log('es1', e));
    }, [userSet]);

    return (
        <View style={styles.container}>
           <SearchInputComponent/>
            <ScrollView style={styles.scroll}>
                {recents.map(user => (
                    <RecentComponent
                        avatar={user.avatarPhotoUrl}
                        name={user.name}
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
