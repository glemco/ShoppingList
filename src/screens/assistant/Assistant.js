import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default class Assistant extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Assistant</Text>
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

