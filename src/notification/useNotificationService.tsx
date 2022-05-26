import React, { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import * as Clipboard from "expo-clipboard";
import { navigate, navigateDispatch, navigationRef } from "../routes/NavigationService";

export enum NotificationTypes {
  HOME = "1",
  PROFILE = "2",
  NOTIFICATION = "3",
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const INITIAL_STATE = {
  routeNames: ["Home"],
  routes: [
    { key: "Home-1", name: "Home" },
  ],
  index: 1,
};

function getDefaultRoute() {
  return {
    routeName: ["Home"],
    route: [
      { key: "Home-1", name: "Home" },
    ],
  };
}


const useNotificationService = () => {
  const notificationListener = useRef();
  const responseListener = useRef();
  const [navState, setNavState] = useState<any>(INITIAL_STATE);

  //-----------------------------------------------------------------------
  const lastNotif = Notifications.useLastNotificationResponse();
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
  useEffect(() => {

    const notif = lastNotif?.notification?.request;
    console.log("Notificatopn Last : ", JSON.stringify(lastNotif));
    console.log("Notificatopn Data : ", JSON.stringify(notif));
    if (!navigationRef.current && lastNotif) {
      (async () => {
        console.log("************************ Last Notif Data :  ");
        await checkNavigation(); // loop until navigator is ready
        notificationType(lastNotif);
      })();
    } else if (navigationRef.current && lastNotif) {
      console.log("************************ navigationRef");
      //   notificationType(lastNotif);
      notificationType(lastNotif);
    } else {
      console.log("************************ ELSE LAST NOTIFICATION");
    }
  }, [lastNotif]);

  const checkNavigation = async () => {
    if (!navigationRef.current) {
      console.log("checkNavigation !!!!")
      await delay(500); // this is for call time exceeded error
      await checkNavigation();
    }
    console.log("checkNavigation @@@@@@@@@@@@@@@")
    if (navigationRef.current) await delay(2000); // this is for giving my app time to set up my navigator
    console.log("checkNavigation ###############")
  };
  //-----------------------------------------------------------------------

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      console.log("Notification Token : ", token);
      Clipboard.setStringAsync("Token: " + token);
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification Received : ", JSON.stringify(notification));
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification Response : ", JSON.stringify(response));
        Clipboard.setStringAsync("MSG GOT: " + JSON.stringify(response));

        setTimeout(() => {
          let notification = response?.notification?.request?.content?.data;
          if (notification) {
            console.log(
              "Expo Notification Data : ",
              JSON.stringify(notification)
            );
          } else {
            //FCM and APNS payload redirection
            notificationType(response);
          }
        }, 1000);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const notificationType = (response: any) => {
    console.log("Notification Data : ", JSON.stringify(response));

    let notification_Type = '0';
    let notificationData = undefined;

    if (Platform.OS === "ios") {
      notification_Type = response?.notification?.request?.trigger?.payload?.notificationData?.type;
      notificationData = response?.notification?.request?.trigger?.payload;
      console.log("IOS : Notification Type : ", notification_Type, notificationData);
    } else {
      notification_Type = response?.notification?.request?.trigger?.remoteMessage?.data?.type;
      notificationData = response?.notification?.request?.trigger?.remoteMessage?.data;
      console.log("Android : Notification Type : ", notification_Type, notificationData);
    }

    switch (notification_Type) {
      case NotificationTypes.HOME:
        androidHome(notificationData);
        break;
      case NotificationTypes.PROFILE:
        androidProfile(notificationData);
        break;
      case NotificationTypes.NOTIFICATION:
        androidNotification(notificationData);
        break;
      default:
        break;
    }
  };

  const androidHome = (notificationData: any) => {
    try {
      console.log(
        "AndroidHome Notification Data : ",
        JSON.stringify(notificationData)
      );
      const { route, routeName } = getDefaultRoute();
      const data = {
        ...navState,
        routes: [{ ...route, params: { notificationData } }],
        index: 0,
      };
      console.log("androidHome : ", JSON.stringify(data));
    } catch (err) {
      console.log("androidHome Err : ", err);
    }
  };

  const androidProfile = (notificationData: any) => {
    try {
      console.log(
        "AndroidProfile Notification Data : ",
        JSON.stringify(notificationData)
      );
      const { route, routeName } = getDefaultRoute();
      const data = {
        ...navState,
        routes: [
          ...route,
          { key: "profile-1", name: "Profile", params: { notificationData } },
        ],
        index: 1,
      };
      console.log("androidProfile : ", JSON.stringify(data));
      navigateDispatch(data)
    } catch (err) {
      console.log("androidProfile Err : ", err);
    }
  };

  const androidNotification = (notificationData: any) => {
    try {
      console.log(
        "AndroidNotification Notification Data : ",
        JSON.stringify(notificationData)
      );
      const { route, routeName } = getDefaultRoute();
      const data = {
        ...navState,
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
      console.log("androidNotification : ", JSON.stringify(data));

      navigateDispatch(data)
    } catch (err) {
      console.log("androidNotification Err : ", err);
    }
  };

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

export default useNotificationService;
