import React, {useEffect, useState} from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    RefreshControl,
    Linking,
} from 'react-native';
import {fetchUserData, getUserById} from '../config/DB_Functions/DB_Functions';
import ProfilePhotoComponent from '../components/ProfilePhotoComponent';
import dimensions from '../config/DeviceSpecifications';
import {Chip, FAB, Surface} from 'react-native-paper';
import BoxComponent from './BoxComponent';
import fbLogo from '../assets/fblogo.jpg';
import igLogo from '../assets/iglogo.jpg';
import twitterLogo from '../assets/twitter.jpg';
import {LinearGradient} from "expo-linear-gradient";

const ViewOtherUser = ({route, navigation, screen}) => {
    const [user, setUser] = useState(null);
    const [userSet, setUserSet] = useState(false);
    const [friend, setFriend] = useState(null);
    const {uid} = route.params;

    console.log('uid: ', route.params);

    useEffect(() => {
        getUserById(uid)
            .then(r => {
                console.log('user data: ', r.userDoc);
                setUser(r.userDoc);
                setUserSet(true);
                console.log('user issss: ', user);
                if (user.friends != null) {
                    getUserById(r.userDoc.friends[user.friends.length - 1])
                        .then(r => {
                            setFriend(r.userDoc);
                            console.log(friend, 'asdsad');
                        })
                        .catch(e => console.log('easds1', e));
                } else {
                    setFriend(null);
                }
            })
            .catch(e => console.log('e1', e));
    }, [userSet]);

    return (
        <ScrollView
            style={styles.scrollView}
        >
            {user ? (
                <View style={styles.container}>
                    <LinearGradient
                        colors={['#9a6cd9', '#F5FCFF']}
                        style={styles.header}
                    >
                        <ProfilePhotoComponent
                            imageStyle={styles.coverPhoto}
                            photoType={'Cover'}
                            user={user}
                            viewOnly={true}
                        />
                        <ProfilePhotoComponent
                            imageStyle={styles.avatar}
                            photoType={'Avatar'}
                            user={user}
                            viewOnly={true}
                        />
                        <Text style={styles.name}>{user.name}</Text>
                        <ScrollView style={styles.scroll} horizontal={true}>
                            {user.interests ? (
                                user.interests.map(interest => (
                                    <Chip icon="heart" key={interest} style={styles.chip}>
                                        {interest}
                                    </Chip>
                                ))
                            ) : (
                                <Text>No interests</Text>
                            )}
                        </ScrollView>
                    </LinearGradient>
                    <Surface style={styles.header2}>
                        <Text style={styles.bio}>Bio: {user.bio}</Text>
                    </Surface>
                    <View style={styles.box}>
                        {friend ? (
                            <BoxComponent
                                title={user.friends.length + ' Friends'}
                                friend={friend.avatarPhotoUrl}
                            />
                        ) : (
                            <BoxComponent title={'0 Friends'}/>
                        )}
                        {friend ? (
                            <BoxComponent
                                title={'New viewers'}
                                friend={friend.avatarPhotoUrl}
                            />
                        ) : (
                            <BoxComponent title={'New viewers'}/>
                        )}
                    </View>
                    <Text style={styles.title}>Socials:</Text>

                    <View style={styles.socials}>
                        <FAB
                            style={styles.socialImageBtn}
                            icon="facebook"
                            onPress={() =>
                                Linking.openURL(
                                    'https://www.instagram.com/' + user.instagram + '/',
                                )
                            }
                        />
                        <FAB
                            style={styles.socialImageBtn}
                            icon="instagram"
                            onPress={() =>
                                Linking.openURL(
                                    'https://www.instagram.com/' + user.instagram + '/',
                                )
                            }
                        />
                        <FAB
                            style={styles.socialImageBtn}
                            icon="twitter"
                            onPress={() => Linking.openURL('https://twitter.com/' + user.twitter)}
                        />
                    </View>
                </View>
            ) : (
                <Text>Loading...</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    container: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
    },
    socials: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        /* Put space between each social icon */
        justifyContent: 'space-between',
        /* Make space between only 10 pixels */
        marginHorizontal: 60,
    },
    socialImageBtn: {},
    header: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        borderBottomWidth: 40,
        borderBottomColor: 'lightgrey',
        paddingBottom: 10,
        flex: 1,
    },
    header2: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        borderBottomWidth: 5,
        borderBottomColor: '#9a6cd9',
        paddingBottom: 10,
        flex: 1,
    },
    coverPhoto: {
        padding: 10,
        width: dimensions.width,
        height: 225,
    },
    avatar: {
        width: 185,
        height: 185,
        borderRadius: 150,
        borderWidth: 4,
        marginTop: -125,
        marginLeft: -165,
        borderColor: 'white',
    },
    name: {
        fontSize: 22,
        color: '#000000',
        fontWeight: '600',
        alignSelf: 'flex-start',
        marginLeft: 10,
    },
    title: {
        fontSize: 22,
        color: '#000000',
        fontWeight: '600',
        alignSelf: 'flex-start',
        marginLeft: 20,
        marginTop: 10,
    },
    bio: {
        fontSize: 16,
        color: '#696969',
        marginTop: 10,
        textAlign: 'center',
        alignSelf: 'flex-start',
        marginLeft: 10,
    },
    socialImage: {
        width: 80,
        height: 80,
        margin: 20,
        borderRadius: 10,
    },
    chip: {
        padding: 4,
        marginTop: 10,
    },
    box: {
        flexDirection: 'row',
        alignItems: 'stretch',
        borderBottomWidth: 5,
        borderBottomColor: '#9a6cd9',
    },
    stats: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#F5FCFF',
    },
    statText: {
        fontSize: 16,
        marginBottom: 10,
    },
    headerContent: {
        alignItems: 'center',
    },
});
export default ViewOtherUser;
