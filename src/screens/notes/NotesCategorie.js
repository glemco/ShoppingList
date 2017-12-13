import React, { Component } from 'react';
import { View, StyleSheet, Text, } from 'react-native';
import Styles from '../../styles/StyleSheet';
import Touchable from '../../styles/Touchable';

import Note from './Note';

export default class NotesCategorie extends Component {


    render() {
        return (
            <View style={styles.container}>
                <Text style={[Styles().title,styles.text]}>
                  {this.props.title}
                </Text>
                {this.props.notes.map(note => (
                    <Note 
                        key={note.id}
                        note={note}
                        editNote={(note) => this.props.editNote(note)}
                    />
                ))}
                <Touchable
                    onPress={() => this.props.addNote()}>
                  <View style={Styles().button}>
                    <Text style={Styles().label}>
                      Add
                    </Text>
                  </View>
                </Touchable>
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
        fontSize: 40,
        marginTop: 10,
        marginBottom: 5,
    }
});

