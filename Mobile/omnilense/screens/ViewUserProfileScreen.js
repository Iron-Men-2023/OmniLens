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
    const {userData} = route.params;

    console.log('uid: ', userData);

    useEffect(() => {
        getUserById(userData.uid)
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
                        <View style={styles.avatarContainer}>
                            <ProfilePhotoComponent
                                imageStyle={styles.avatar}
                                photoType={'Avatar'}
                                user={user}
                                viewOnly={true}
                                containerStyle={styles.avatarInnerContainer}
                            />
                        </View>
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
                                navigation={navigation}
                                userData={friend}
                                screen={'OtherUserFriends'}
                            />
                        ) : (
                            <BoxComponent title={'0 Friends'}/>
                        )}
                        {friend ? (
                            <BoxComponent
                                title={'New viewers'}
                                userData={friend}
                                navigation={navigation}
                                screen={'OtherUserProfile'}
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
        zIndex: 0, // Add this line
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
    header2: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        borderBottomWidth: 5,
        borderBottomColor: '#9a6cd9',
        paddingBottom: 10,
        flex: 1,
    },
    header: {
        paddingBottom: 20,
        zIndex: 1,
    },
    photosWrapper: {
        position: 'relative',
        flex: 1,
    },
    coverPhoto: {
        width: '100%',
        height: 200,
        zIndex: 12,
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 100,
        borderColor: '#FFF',
        borderWidth: 3,
        position: 'absolute',
        top: -50, // Adjust this value to position the avatar properly
        left: 15, // Adjust this value to position the avatar properly
        zIndex: 1,
    },
    name: {
        fontSize: 22,
        color: '#000000',
        fontWeight: '600',
        alignSelf: 'flex-start',
        marginLeft: 10,
        marginTop: 10,
        paddingTop: 10,
        position: 'relative'
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
    avatarContainer: {
        position: 'absolute',
        top: 150, // Adjust this value to position the avatar properly
        left: 20, // Adjust this value to position the avatar properly
    },
    avatarInnerContainer: {
        position: 'relative',
        top: 0,
        left: 0,
    },
});
export default ViewOtherUser;
