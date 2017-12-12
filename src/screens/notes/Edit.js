import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableNativeFeedback,
        Button, TextInput } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Styles from '../../styles/StyleSheet';

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
            isDateTimePickerVisible: false
        }
    }

    _handleDatePicked(date) {
        this.setState(state => {
            state.note.date = date.toISOString().substring(0, 10);
            state.isDateTimePickerVisible = false;
            return state;
        });
    }
    
    render() {
        const note = this.state.note;
        return (
            <View style={Styles().cont}>
                <TextInput
                    style={[Styles().title, styles.title]}
                    onChangeText={(text) => this.setState(state => {
                        state.note.title = text;
                        return state;
                    })}
                    value={note.title}
                />
                <TouchableNativeFeedback
                    color={StyleSheet.flatten(Styles().title).color}
                    onPress={() => this.setState({ isDateTimePickerVisible: true })}>
                  <View style={Styles().button}>
                    <Text style={Styles().label}>
                      {note.date.toString()}
                    </Text>
                  </View>
                </TouchableNativeFeedback>
                <DateTimePicker
                    date={new Date(note.date)}
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={(date) => this._handleDatePicked(date)}
                    onCancel={() => this.setState({ isDateTimePickerVisible: false })}
                />
                <TextInput
                    style={Styles().txt}
                    multiline={true}
                    autoGrow={true}
                    onChangeText={(text) => this.setState(state => {
                        state.note.content = text;
                        return state;
                    })}
                    value={note.content}
                />
                <TouchableNativeFeedback
                    onPress={() => this.saveNoteEdit(note)}>
                  <View style={Styles().button}>
                    <Text style={Styles().label}>
                      Save modifications
                    </Text>
                  </View>
                </TouchableNativeFeedback>
                <View style={{ flex: 1 }}></View>
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
    },
    title: {
        padding: 5,
        fontSize: 40,
    },
    content: {
        padding: 5,
    }
});

