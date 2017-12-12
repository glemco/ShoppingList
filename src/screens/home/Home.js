import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, Button } from 'react-native';

import firebase from './../../service/Database';

export default class Home extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Image
                    style={{width: 300, height: 300}}
                    source={require('../../../assets/img/logo.png')}
                />
                <Text style={styles.text}>Alfred welcomes you !</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:  {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: 'yellow',
        fontSize: 40,
        textAlign: 'center',
    }
});

