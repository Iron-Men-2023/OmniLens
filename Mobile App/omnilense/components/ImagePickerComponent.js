import React, {useState, useEffect} from 'react';
import {Button, Image, View, Platform} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {Dimensions} from 'react-native';

export default function ImagePickerComponent({setImageSet, setPhoto}) {
  const [image, setImage] = useState(null);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      resize: {width: 800, height: 800},
    });

    console.log(result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setPhoto({uri: result.assets[0].uri});
      setImageSet(true);
    }
  };

  return (
    <View>
      <Button
        title="Upload an Image of yourself"
        onPress={pickImage}
        style={{width: windowWidth * 0.8, height: windowHeight * 0.2}}
      />
      {image && (
        <Image
          source={{uri: image}}
          style={{width: windowWidth * 0.8, height: windowHeight * 0.2}}
        />
      )}
    </View>
  );
}
