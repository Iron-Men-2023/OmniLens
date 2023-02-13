import React from 'react';
import {Button, Image, Text, View} from "react-native";
import ProfileScreen from "./ProfileScreen";
import Onboarding from 'react-native-onboarding-swiper';

function OnboardingScreen({navigation}) {


    return (
        <Onboarding
            onSkip={() => navigation.navigate('')}
            onDone={() => navigation.navigate('Home')}

            pages={[
                {
                    backgroundColor: 'rgba(229,172,67,0.87)',
                    image: <Image source={require('../assets/onboard1new.png')} />,
                    title: 'Connect with friends',
                    subtitle: 'Easily meet and connect with new people using omnilense',
                },
                {
                    backgroundColor: 'rgba(19,224,231,0.85)',
                    image: <Image source={require('../assets/onboard2new.png')} />,
                    title: 'Explore new possibilities',
                    subtitle: 'Discover a world you never thought possible',
                },
                {
                    backgroundColor: '#36ec36',
                    image: <Image source={require('../assets/onboard3.png')} />,
                    title: 'Be in control',
                    subtitle: 'Decide what can and cant be seen by other omnilense users, easile restrict access to sensitive data',
                }
            ]}
        />
    );
}

export default OnboardingScreen;
