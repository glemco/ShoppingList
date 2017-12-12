import React, { Component } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';

import { Notifications } from 'expo';

export default class Test extends Component {

    async notification() {

        let token = await Notifications.getExpoPushTokenAsync();

        fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'accept-encoding': 'gzip, deflate',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                to: token,
                title: 'New smart note',
                body: 'test',
                android: {
                    color: 'black'
                }
            })
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Test</Text>
                <Button 
                    title="Notification"
                    color="black"
                    onPress={() => this.notification()}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: 'yellow',
        fontSize: 40,
        textAlign: 'center',
    }
});