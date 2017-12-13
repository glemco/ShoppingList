import React, { Component } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';

import { Notifications } from 'expo';
import Styles from './../../styles/StyleSheet.js';

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
        <View style={[Styles().cont,styles.container]}>
          <Text style={Styles().title}>Test</Text>
          <Button 
              title="Notification"
              color={StyleSheet.flatten(Styles().bar).backgroundColor}
              onPress={() => this.notification()}
          />
        </View>
      );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: 'yellow',
        fontSize: 40,
        textAlign: 'center',
    }
});
