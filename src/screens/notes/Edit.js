import React, { Component } from 'react';
import { View, StyleSheet, Text, Button, TextInput } from 'react-native';
import { NavigationActions } from 'react-navigation';

export default class Edit extends Component {

    saveNoteEdit(note) {
        const navigation = this.props.navigation;

        // change the state of the Notes screen
        navigation.state.params.saveNoteEdit(note);

        // return to the Notes screen
        navigation.goBack();
    }

    deleteNoteEdit(note) {
        const navigation = this.props.navigation;

        // change the state of the Notes screen
        navigation.state.params.deleteNoteEdit(note);

        // return to the Notes screen
        navigation.goBack();
    }

    constructor(props) {
        super(props);
        this.state = {
            note: this.props.navigation.state.params.note,
        }
    }
    
    render() {
        const note = this.state.note;
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.title}
                    onChangeText={(text) => this.setState(state => {
                        state.note.title = text;
                        return state;
                    })}
                    value={note.title}
                />
                <TextInput
                    style={styles.content}
                    multiline={true}
                    autoGrow={true}
                    onChangeText={(text) => this.setState(state => {
                        state.note.content = text;
                        return state;
                    })}
                    value={note.content}
                />
                <Button
                    title="Save modifications"
                    color="black"
                    onPress={() => this.saveNoteEdit(note)}
                />
                <View style={styles.space}></View>
                <Button
                    title="Delete note"
                    color="red"
                    onPress={() => this.deleteNoteEdit()}
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
    },
    title: {
        color: 'white',
        padding: 5,
        color: 'yellow',
        fontSize: 40,
    },
    content: {
        color: 'white',
        padding: 5,
        color: 'yellow',
    },
    space: {
        flex: 1,
    }
});

