import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SplashScreen: React.FC = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      if (global.notificationData) {
        console.log("GLOBAL NOTIFICATION DATA : ", global.notificationData);
        global.notificationData = undefined;
      } else {
        console.log("Home Redirect : ");
        navigation.reset({ routes: [{ name: "Home" }] });
      }
    }, 3000);
  }, []);

  return (
    <SafeAreaView style={styles.rootView}>
      <Text>Notification Demo</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SplashScreen;
