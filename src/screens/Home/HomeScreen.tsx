import { useRoute } from "@react-navigation/native";
import React from "react";
import { Text, View } from "react-native";
import styles from "./HomeStyle";

const HomeScreen: React.FC = () => {
  const params = useRoute()?.params;

  return (
    <View style={styles.rootView}>
      <Text>Home Screen</Text>
      <Text>
        Notification Data : {JSON.stringify(params?.notificationData)}{" "}
      </Text>
    </View>
  );
};

export default HomeScreen;
