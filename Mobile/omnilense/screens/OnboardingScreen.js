import React from 'react';
import {Button, Image, Text, View} from "react-native";
import ProfileScreen from "./ProfileScreen";
import Onboarding from 'react-native-onboarding-swiper';

function OnboardingScreen({navigation}) {


    return (
        <Onboarding
            onSkip={() => navigation.navigate('Sign In')}
            onDone={() => navigation.navigate('Sign In')}

            pages={[
                {
                    backgroundColor: 'rgba(253,144,101,0.75)',
                    image: <Image source={require('../assets/Logo-removebg.png')} />,
                    title: 'Welcome to Omnilens',
                    subtitle: 'Get ready to make connections in a whole new way never thought possible',
                },
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
                    subtitle: "Decide what can and can't be seen by other omnilense users, easile restrict access to sensitive data",
                }
            ]}
        />
    );
}

export default OnboardingScreen;
