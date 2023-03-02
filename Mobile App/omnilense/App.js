import 'react-native-gesture-handler';
import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import Navigation from './routes/Navigation';
import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: 'https://643db536fe184518ad4ef10358032cdd@o4504765876928512.ingest.sentry.io/4504765879353344',
  enableInExpoDevelopment: true,
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

export default function App() {
  return <Navigation />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
