import React, {useEffect, useRef, useState} from 'react';
import {Text, View, StyleSheet, FlatList, SafeAreaView, ScrollView} from 'react-native';
import Recent from "../components/Recent"
import {auth, db} from "../config/firebaseConfig";
import {getUserById} from "../config/DB_Functions/DB_Functions";
import Header from "../components/Header";
import {useTheme} from "react-native-paper";

function Feed({navigation}) {

    const [user, setUser] = useState(null);
    const [userSet, setUserSet] = useState(false);
    const [recents, setRecents] = useState([]);
    const [emails, setEmails] = useState([]);
    const [searchedRecents, setSearchedRecents] = useState([]);
    const [searchText, setSearchText] = useState('');
    const recentsRef = useRef([]);
    const emailsRef = useRef([]);
    const {colors} = useTheme();


    function dynamicSearch(text) {
        if (text === '') {
            setSearchText(text);
            setSearchedRecents(recentsRef.current);
            return;
        }
        setSearchText(text);
        setSearchedRecents(recentsRef.current.filter(element => element.name.includes(text)));
    }

    useEffect(() => {
        // Get the current user's doc reference
        const userDocRef = db.collection('users').doc(auth.currentUser.uid);

        // Get the current user's data and listen for changes to their recents field
        const unsubscribe = userDocRef.onSnapshot(doc => {
            if (doc.exists) {
                const userData = doc.data();
                setUser(userData);
                setUserSet(true);

                // Iterate through the recents array and get the user data for each recent user
                for (let id in userData.recents) {
                    if (userData.recents[id] !== auth.currentUser.uid) {
                        getUserById(userData.recents[id])
                            .then(a => {
                                if (!emailsRef.current.includes(a.userDoc.email)) {
                                    recentsRef.current.push(a.userDoc)
                                    emailsRef.current.push(a.userDoc.email)
                                }
                                console.log('list', recentsRef, emailsRef.current);
                            })
                            .catch(e => console.log('es2', e));
                    }
                }
            } else {
                console.log('No user data found');
            }
        });

        // Unsubscribe from the listener when the component unmounts
        return () => unsubscribe();
    }, [userSet]);
    return (
        <>
            <View>
                <FlatList
                    data={searchText.length === 0 ? recentsRef.current : searchedRecents}
                    renderItem={({item}) => (
                        <Recent data={item} loggedInUser={user} navigation={navigation}/>
                    )}
                    keyExtractor={(item) => item.uid}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        user ? (
                            <Header
                                user={user}
                                search={dynamicSearch}
                                navigation={navigation}
                            />
                        ) : null
                    }
                />
            </View>
            <View style={styles.backPanel}>
                <View style={{height: 300, backgroundColor: colors.primary}}/>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    backPanel: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: -1,
    },
    container: {
        flex: 1,

    }
});
export default Feed;
