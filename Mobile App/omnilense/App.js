import 'react-native-gesture-handler';
import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import Navigation from './routes/Navigation';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';

// const theme = {
//   ...DefaultTheme,
//   colors: {
//     ...DefaultTheme.colors,
//     primary: 'blue',
//     secondary: 'white',
//   },
// };

import * as TaskManager from 'expo-task-manager';
import {useEffect} from 'react';

TaskManager.defineTask('myTask', ({data, error}) => {
  if (error) {
    console.log('TaskManager Error:', error);
    return;
  }
  if (data) {
    const {taskId} = data;
    console.log(`TaskManager Data: ${JSON.stringify(data)}`);
    TaskManager.finishTaskAsync(taskId);
  }
});

async function registerBackgroundTask() {
  await TaskManager.registerTaskAsync('myTask', {
    minimumInterval: 60,
    allowsExecutionInForeground: true,
  });
}

export default function App() {
  useEffect(() => {
    registerBackgroundTask()
      .then(r => {
        console.log('Background Task Set: ', r);
      })
      .catch(e => {
        console.log('Background Task Error: ', e);
      });
  }, []);
  return (
    <PaperProvider>
      <Navigation />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
