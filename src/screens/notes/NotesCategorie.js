import React, { Component } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';

import Note from './Note';

export default class NotesCategorie extends Component {


    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>{this.props.title}</Text>
                {this.props.notes.map(note => (
                    <Note 
                        key={note.id}
                        note={note}
                        editNote={(note) => this.props.editNote(note)}
                    />
                ))}
                <Button 
                    title="Add"
                    color="black"
                    onPress={() => this.props.addNote()}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 5,
        marginBottom: 10,
    },
    text: {
        color: 'yellow',
        fontSize: 40,
        marginTop: 10,
        marginBottom: 5,
    }
});

