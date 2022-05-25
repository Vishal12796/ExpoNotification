import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from "../screens/SplashScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import NotificationScreen from "../screens/Notification/Notification";
import { navigationRef } from "./NavigationService";

const Stack = createNativeStackNavigator();

const Navigate: React.FC = () => {

    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="Notification" component={NotificationScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Navigate