import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableHighlight } from 'react-native';
import Styles from '../../styles/StyleSheet';

export default class Note extends Component {
    
    getDate(date) {
        date = new Date(date);
        const now = new Date();
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        if (now.getFullYear() == date.getFullYear()) {

            if (now.getDay() == date.getDay() && 
                now.getMonth() == date.getMonth()
            ) {
                return 'Today';
            }
            else {
                let dayAgo = parseInt((now.getTime() - date.getTime()) / (24 * 3600 * 1000));

                if (dayAgo < 7) 
                    return days[date.getDay()];
                else if (dayAgo > 7)
                    return 'next ' + days[date.getDay()];
                else
                    return date.getDate() + ' ' + months[date.getMonth()];
            }
        }
        else
            return date.getFullYear();
    }

    render() {
        const note = this.props.note;
        return (
            <TouchableHighlight 
                onPress={() => this.props.editNote(note) }
            >
                <View style={[styles.container, Styles().mainColorBg]}>
                    <View style={styles.row}>
                        <Text style={[Styles().txt, styles.title]}>{note.title}</Text>
                        <Text style={[Styles().txt, styles.date]}>{this.getDate(note.date)}</Text>
                    </View>
                    <Text style={[Styles().txt, styles.content]}>{note.content}</Text>
                </View>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 5,
        padding: 5,
        backgroundColor: '#FFFCC1',
    },
    row: {
        flexDirection: 'row',
    },
    title: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
    },
    date: {
        paddingLeft: 5,
    },
    content: {
        marginTop: 10,
    }
});

