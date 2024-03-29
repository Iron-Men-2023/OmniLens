import React, {useState} from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import dimensions from '../config/DeviceSpecifications';
import SearchInputComponent from '../components/SearchInputComponent';
import InterestComponent from '../components/InterestComponent';
import TextButtonComponent from '../components/TextButtonComponent';
import {createUser, setImageForUser, updateInterests} from '../config/DB_Functions/DB_Functions';

function InterestsScreen({navigation, route}) {
    const {name, photoUrl} = route.params;
    console.log("Route params: ", route.params, "name, photoUrl");
    console.log(name, photoUrl, 'name, photoURL');
    console.log("PhotoUrl: ", photoUrl);
    const Interests = [
        'Football',
        'Music',
        'Skiing',
        'Snowboarding',
        'Festivals',
        'Tattoos',
        'Activism',
        'Instagram',
        'Aquarium',
        'Food Tours',
        'K-pop',
        'Walking',
        'Sports',
        'Photography',
        'Reading',
        'Clubbing',
        'Shopping',
        'Start Ups',
        'Boba Tea',
        'Cars',
        'Rugby',
        'Badminton',
        'Boxing',
        'Soccer',
        'Self care',
        'Meditation',
        'Yoga',
        'Basketball',
        'Slam Poetry',
        'Running',
        'Gym',
        'Skincare',
        'Social Media',
        'Fortnite',
        'Jiu-jitsu',
        'Karate',
        'Ice Cream',
        'Marvel',
        'Anime',
        'Netflix',
    ];
    const [searchText, setSearchText] = useState('');
    const [selected, setSelected] = useState([]);
    const [results, setResults] = useState(Interests);

    function updateSearchText(text) {
        setSearchText(text);
        setResults(Interests.filter(element => element.includes(text)));
    }

    return (
        <View style={styles.container}>
            <View style={styles.interests}>
                <Text style={styles.headerText}>
                    Add Interests ({selected.length}/5)
                </Text>
                <SearchInputComponent changeText={updateSearchText}/>
                <ScrollView style={styles.scroll} horizontal={true}>
                    {selected.map(interest => (
                        <InterestComponent
                            interest={interest}
                            setSelected={setSelected}
                            selected={selected}
                            removable={true}
                        />
                    ))}
                </ScrollView>
            </View>
            <View style={[styles.scroll, {marginTop: dimensions.height * 0.02}]}>
                {results.map(interest => (
                    <InterestComponent
                        interest={interest}
                        selected={selected}
                        setSelected={setSelected}
                    />
                ))}
            </View>
            <View style={styles.textBtn}>
                <TextButtonComponent text="Next" onPress={async () => {
                    if (selected.length < 5) {
                        alert('Please select 5 interests');
                    } else if (selected.length === 5) {
                        await createUser(name, photoUrl, selected);
                        setTimeout(() => {
                            navigation.navigate('Home');
                        }, 800);
                    }

                }
                }/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'stretch',
    },
    interests: {
        marginTop: dimensions.height * 0.05,
        alignItems: 'stretch',
        backgroundColor: '#fff',
        height: dimensions.height * 0.22,
    },
    headerText: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    scroll: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    textBtn: {
        alignItems: 'flex-end',
        marginRight: 30,
    },
});

export default InterestsScreen;
