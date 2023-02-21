import React from 'react';
import {Text, View, StyleSheet, ScrollView} from "react-native";
import SearchInputComponent from "../components/SearchInputComponent";
import RecentComponent from "../components/RecentComponent";
import dimensions from "../config/DeviceSpecifications"
function FeedScreen(props) {
    return (
        <View style={styles.container}>
           <SearchInputComponent/>
            <ScrollView style={styles.scroll}>
                <RecentComponent/>
                <RecentComponent/>

                <RecentComponent/>
                <RecentComponent/>
                <RecentComponent/>

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
