import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Agenda } from 'react-native-calendars';

import firebase from '../../service/Database';

import CalendarItem from './CalendarItem';
import CalendarDay from './CalendarDay';
import CalendarEmpty from './CalendarEmpty';

export default class Calendar extends Component {

    componentDidMount() {
        firebase.database().ref('notes').on('value', notes => {
            const agendaItems = {};

            notes.val().forEach((note, noteId) => {

                if (!agendaItems[note.date]) {
                    agendaItems[note.date] = [];
                }

                agendaItems[note.date].push({
                    title: note.title,
                    content: note.content,
                    id: noteId
                });
            });

            this.setState({agendaItems: agendaItems});
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            agendaItems: []
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Agenda
                    current={Date.now()}
                    theme={agendaTheme}
                    style={styles.agenda}
                    items={this.state.agendaItems}
                    // specify how each item should be rendered in agenda
                    renderItem={(note, firstItemInDay) => <CalendarItem note={note} firstItemInDay={firstItemInDay} />}
                    // renderItem={(note, firstItemInDay) => <View />}
                    // specify how each date should be rendered. day can be undefined if the item is not first in that day.
                    // renderDay={(day, note) => <CalendarDay note={note} />}
                    renderDay={(day, item) => <View />}
                    // specify how empty date content with no items should be rendered
                    renderEmptyDate={() => <CalendarEmpty />}
                    // specify what should be rendered instead of ActivityIndicator
                    renderEmptyData={() => <CalendarEmpty />}
                    // specify your item comparison function for increased performance
                    rowHasChanged={(r1, r2) => ( r1.id !== r2.id )}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    }
});

const agendaTheme = {
    calendarBackground: 'black',
    textSectionTitleColor: 'yellow',
    monthTextColor: 'yellow',
    dayTextColor: 'white',
    
    // agendaDayTextColor: 'yellow',
    // agendaDayNumColor: 'yellow',
    agendaTodayColor: 'red',
    agendaKnobColor: 'yellow'
}