import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import NotificationService from './src/notification/NotificationService';
import Navigate from './src/routes/Navigate';

export default function App() {

  return (
    <>
      {/* <NotificationService /> */}
      <Navigate />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
