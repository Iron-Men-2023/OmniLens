import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from "react-native";
import { Entypo } from '@expo/vector-icons';

function InterestComponent({interest,setSelected,selected,removable,}) {
    function addInterest(){
        console.log(selected)
        selected.length<5 && !selected.includes(interest)? setSelected([...selected,interest]): null
    }
    function removeInterest(){
        const tempList = [...selected]
        console.log(tempList.indexOf(interest))
        tempList.splice(tempList.indexOf(interest),1)
        setSelected([...tempList])
    }
    return (
        !removable?

        <TouchableOpacity style={selected.includes(interest)? styles.selectedContainer :styles.container} onPress={addInterest}>
            <Text>{interest}</Text>
        </TouchableOpacity>:
        <View style={styles.container2} onPress={addInterest}>
            <TouchableOpacity onPress={removeInterest}>
                <Entypo name="cross" size={24} color="white" />
            </TouchableOpacity>
            <Text style={[{color: "#fff"}]}>{interest}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 60,
        padding: 10,
        margin: 5,
        borderColor: "#000000",
        borderWidth: 1,
    },
    container2: {
        flexDirection: "row",
        borderRadius: 60,
        padding: 10,
        margin: 2,
        borderColor: "#000000",
        borderWidth: 1,
        backgroundColor: "rgb(12,51,114)",
        color: "#fff"
    },
    selectedContainer: {
        borderRadius: 60,
        padding: 10,
        margin: 5,
        borderColor: "#de3e3e",
        borderWidth: 2,
    }
})
export default InterestComponent;
