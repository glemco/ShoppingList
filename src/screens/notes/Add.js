import React, { Component } from 'react';
import { View, StyleSheet, Text, Button,
      TouchableNativeFeedback, TextInput } from 'react-native';
import { NavigationActions } from 'react-navigation';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Styles from '../../styles/StyleSheet';

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
            isDateTimePickerVisible: false,
            note: {
                title: '',
                date: new Date().toISOString().substring(0, 10),
                content: '',
            }
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
            <View style={styles.container}>
                <TextInput
                    style={[Styles().title, styles.title]}
                    placeholder="Title"
                    onChangeText={(text) => this.setState(state => {
                        state.note.title = text;
                        return state;
                    })}
                    value={note.title}
                />
                <TouchableNativeFeedback
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
                    placeholder="Content"
                    multiline={true}
                    autoGrow={true}
                    onChangeText={(text) => this.setState(state => {
                        state.note.content = text;
                        return state;
                    })}
                    value={note.content}
                />
                <View style={{ flex: 1 }}></View>
                <Button
                    disabled={(note.title == '' && note.content == '')}
                    title="Save"
                    color={StyleSheet.flatten(Styles().title).color}
                    onPress={() => this.saveNoteAdd(note)}
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
    }
});

