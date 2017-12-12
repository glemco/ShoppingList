import React, { Component } from 'react';
import { View, StyleSheet, Text, Button, TextInput } from 'react-native';
import { NavigationActions } from 'react-navigation';

export default class saveNoteAdd extends Component {

    saveNoteAdd(note) {
        const navigation = this.props.navigation;

        // change the state of the Notes screen
        navigation.state.params.saveNoteAdd(note);

        // return to the Notes screen
        navigation.goBack();
    }

    constructor(props) {
        super(props);
        this.state = {
            note: {
                title: '',
                date: new Date(),
                content: '',
            }
        }
    }
    
    render() {
        const note = this.state.note;
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.title}
                    placeholder="Title"
                    onChangeText={(text) => this.setState(state => {
                        state.note.title = text;
                        return state;
                    })}
                    value={note.title}
                />
                <TextInput
                    style={styles.content}
                    placeholder="Content"
                    multiline={true}
                    autoGrow={true}
                    onChangeText={(text) => this.setState(state => {
                        state.note.content = text;
                        return state;
                    })}
                    value={note.content}
                />
                {(note.title != '' || note.content != '') && (
                    <Button
                        title="Save"
                        color="black"
                        onPress={() => this.saveNoteAdd(note)}
                    />
                )}
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
    }
});

