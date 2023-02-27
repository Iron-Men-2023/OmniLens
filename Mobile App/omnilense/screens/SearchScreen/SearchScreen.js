import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {addRecents} from '../../config/DB_Functions/DB_Functions';

function SearchScreen(props) {
  async function test() {
    await addRecents();
  }

  return (
    <View style={styles.container}>
      <Text>Search</Text>
      <Button title={'test'} onPress={test} />
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
