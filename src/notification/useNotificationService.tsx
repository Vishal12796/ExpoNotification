import React, { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import * as Clipboard from "expo-clipboard";
import { navigateDispatch, navigationRef } from "../routes/NavigationService";

export enum NotificationTypes {
  PROFILE = "Profile",
  NOTIFICATION = "Notification",
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const INITIAL_STATE = {
  routes: [{ key: "Home-1", name: "Home" }],
  index: 1,
};

function getDefaultRoute() {
  return {
    routeName: ["Home"],
    route: [{ key: "Home-1", name: "Home" }],
  };
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const checkNavigation = async () => {
  if (!navigationRef.current) {
    console.log("******* Ref Not Get:");
    await delay(500); // this is for call time exceeded error
    await checkNavigation();
  }
  console.log("******* Ref Got:");
  if (navigationRef.current) await delay(1000); // this is for giving my app time to set up my navigator
};

Notifications.addNotificationResponseReceivedListener((response) => {
  console.log(
    "addNotificationResponseReceivedListener Notification Response : ",
    JSON.stringify(response)
  );

  (async () => {
    console.log("******* Start Loop :  ");
    await checkNavigation(); // loop until navigator is ready
    notificationType(response);
  })();
});

const useNotificationService = () => {
  const notificationListener = useRef();
  const responseListener = useRef();
  const [navState, setNavState] = useState<any>(INITIAL_STATE);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      console.log("Notification Token : ", token);
      Clipboard.setStringAsync("Token: " + token);
    });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return { navState };
};

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    let expoToken = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("***************** Expo Token : ", expoToken);

    token = (await Notifications.getDevicePushTokenAsync()).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

export const notificationType = (response: any) => {
  console.log("Notification Data : ", JSON.stringify(response));
  let notification_Type = "0";
  let notificationData = undefined;

  if (Platform.OS === "ios") {
    notification_Type =
      response?.notification?.request?.trigger?.payload?.notificationData?.type;
    notificationData = response?.notification?.request?.trigger?.payload;
    console.log(
      "IOS : Notification Type : ",
      notification_Type,
      notificationData
    );
  } else {
    notification_Type =
      response?.notification?.request?.trigger?.remoteMessage?.data?.type;
    notificationData =
      response?.notification?.request?.trigger?.remoteMessage?.data;
    console.log(
      "Android : Notification Type : ",
      notification_Type,
      notificationData
    );
  }

  switch (notification_Type) {
    case NotificationTypes.PROFILE:
      notificationProfile(notificationData);
      break;
    case NotificationTypes.NOTIFICATION:
      notificationNotification(notificationData);
      break;
    default:
      global.notificationData = undefined;
      break;
  }
};

export const notificationProfile = (notificationData: any) => {
  try {
    global.notificationData = notificationData;
    console.log(
      "notificationProfile Notification Data : ",
      JSON.stringify(notificationData)
    );
    const { route } = getDefaultRoute();
    const data = {
      ...INITIAL_STATE,
      routes: [
        ...route,
        { key: "profile-1", name: "Profile", params: { notificationData } },
      ],
      index: 1,
    };
    console.log("notificationProfile : ", JSON.stringify(data));
    navigateDispatch(data);
  } catch (err) {
    console.log("notificationProfile Err : ", err);
  }
};

export const notificationNotification = (notificationData: any) => {
  try {
    global.notificationData = notificationData;
    console.log(
      "notificationNotification Notification Data : ",
      JSON.stringify(notificationData)
    );
    const { route } = getDefaultRoute();
    const data = {
      ...INITIAL_STATE,
      routes: [
        ...route,
        {
          key: "notification-1",
          name: "Notification",
          params: { notificationData },
        },
      ],
      index: 1,
    };
    console.log("notificationNotification : ", JSON.stringify(data));

    navigateDispatch(data);
  } catch (err) {
    console.log("notificationNotification Err : ", err);
  }
};

export default useNotificationService;
