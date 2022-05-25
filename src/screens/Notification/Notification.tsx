import { useNavigation, useRoute } from '@react-navigation/native'
import React from 'react'
import { Text, View } from 'react-native'
import styles from './NotificationStyle'

const NotificationScreen: React.FC = () => {

    const params = useRoute()?.params

    return (
        <View style={styles.rootView}>
            <Text>Notification Screen</Text>
            <Text> Notification Data : {JSON.stringify(params?.notificationData)} </Text>
        </View>
    )
}

export default NotificationScreen