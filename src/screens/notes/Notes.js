import React, { Component } from 'react';
import { ScrollView, StyleSheet  } from 'react-native';

import firebase from '../../service/Database';

import NotesCategorie from './NotesCategorie';

export default class Notes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            notes: [],
            categories: [],
        }
    }

    componentDidMount() {
        firebase.database().ref().on('value', data => {
            this.setState(data.val());
        });
    }

    editNote(note) {
        this.props.navigation.navigate('Edit', { 
            note: note,
            saveNoteEdit: (note) => this.saveNoteEdit(note),
            deleteNoteEdit: () => this.deleteNoteEdit(note.id),
        });
    }

    saveNoteEdit(note) {
        this.setState(state => {
            state.notes[note.id] = note;
            return state;
        });
    }

    deleteNoteEdit(noteId) {
        this.setState(state => {
            state.notes.splice(noteId, 1);
            return state;
        });
    }

    addNote(categorieId) {
        this.props.navigation.navigate('Add', {
            saveNoteAdd: (note) => this.saveNoteAdd(note, categorieId),
        });
    }

    saveNoteAdd(note, categorieId) {
        note.categorieId = categorieId;
        this.setState(state => {
            state.notes.push(note);
            return state;
        });
    }

    putNotesWithId() {
        this.state.notes.forEach((note, noteId) => {
            note.id = noteId;
            return note;
        });
    }

    render() {
        this.putNotesWithId();

        return (
            <ScrollView style={styles.container}>
                {this.state.categories.map((categorie, categorieId) => (
                    <NotesCategorie
                        key={categorieId}
                        title={categorie}
                        editNote={(note) => this.editNote(note)}
                        addNote={() => this.addNote(categorieId)}
                        notes={this.state.notes.filter(note => (
                            note.categorieId == categorieId
                        ))}
                    />
                ))}
            </ScrollView >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
    }
});

