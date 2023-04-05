import React from "react";
import {View, Image, StyleSheet} from "react-native";
import {Text, Avatar, useTheme} from "react-native-paper";
import logo from "../assets/Logo-removebg.png";
import SearchInputComponent from "./SearchInputComponent";
import {LinearGradient} from "expo-linear-gradient";

const Header = ({user, search, navigation}) => {
    const {colors} = useTheme();

    return (
        <LinearGradient
            colors={['#8a2be2', '#4b0082', '#800080']}
            style={styles.container}
        >
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <View style={{flexDirection: "row"}}>
                    <Image source={logo} style={{height: 40, width: 40}}/>
                    <Text
                        style={{
                            color: colors.background,
                            fontSize: 18,
                            fontWeight: "bold",
                            marginTop: 7,
                        }}
                    >
                        OmniLens
                    </Text>
                </View>
                <View>
                    <Avatar.Image
                        size={45}
                        source={{uri: user.avatarPhotoUrl}}
                        onPress={() => navigation.navigate("Profile")}
                    />
                </View>
            </View>
            <View style={{marginVertical: 20}}>
                <Text style={{fontSize: 14, color: colors.background}}>
                    {" "}
                    Hello, {user.name} 👋🏼
                </Text>
                <Text
                    style={{
                        fontSize: 18,
                        color: colors.background,
                        fontWeight: "bold",
                    }}
                >
                    Search through your recents
                </Text>
            </View>
            <View style={{marginTop: 5}}>
                <SearchInputComponent changeText={search}/>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 50,
        paddingBottom: 50,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
});
export default Header;

