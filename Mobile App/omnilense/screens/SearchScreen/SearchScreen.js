import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

function SearchScreen(props) {
  return (
    <View style={styles.container}>
      <Text>Search</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default SearchScreen;
