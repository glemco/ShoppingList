import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, Button } from 'react-native';

import { Notifications } from 'expo';

export default class Settings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            notificationToken: '',
        }
    }

    async componentWillMount() {
        let token = await Notifications.getExpoPushTokenAsync();

        this.setState({ notificationToken: token });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Settings</Text>
                <Text style={styles.token}>{this.state.notificationToken}</Text>
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
    },
    token: {
        color: 'yellow',
        textAlign: 'center',
    }
});

