import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default class CalendarDay extends Component {
    render() {
        const note = this.props.note;
        return (
            <View style={styles.container} key={note.id}>
                <Text style={styles.title}>{note.title}</Text>
                <Text style={styles.content}>{note.content}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 5,
        marginBottom: 10,
    },
    title: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        marginTop: 10,
    }
});