import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import useNotificationService from '../notification/NotificationService'
import * as Application from 'expo-application';

const SplashScreen: React.FC = () => {

    const navigation = useNavigation()

    useEffect(() => {
        console.log("APP ID : ", Application.applicationId)
        setTimeout(() => {
            navigation.navigate('Home')
        }, 3000)

    }, [navigation])

    return (
        <SafeAreaView style={styles.rootView}>
            <Text>Notification Demo</Text>
        </SafeAreaView>)
}

const styles = StyleSheet.create({
    rootView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default SplashScreen