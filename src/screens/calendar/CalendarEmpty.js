import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default class CalendarEmpty extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>No notes</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: 'black'
    },
    text: {
        marginTop: 20,
        // color: 'yellow',
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
    }
});