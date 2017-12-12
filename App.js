import React, { Component } from 'react';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';

import registerForPushNotificationsAsync from './src/api/registerForPushNotificationsAsync';

import NavTabs from './src/navigation/NavTabs';

export default class App extends Component {
    render() {
        return (
            <View style={styles.container}>
                <NavTabs />
            </View>
        )
    }

    componentDidMount() {
        registerForPushNotificationsAsync();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    }
});