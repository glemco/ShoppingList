import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native';
import Styles from '../../styles/StyleSheet';

import NotesCategorie from './NotesCategorie';

export default class Notes extends Component {

    editNote(note) {
        this.props.navigation.navigate('Edit', { 
            note: note,
            saveNoteEdit: (note) => this.saveNoteEdit(note),
            deleteNoteEdit: () => this.deleteNoteEdit(note.id),
        });
    }

    saveNoteEdit(note) {
        let { notes } = this.props.screenProps;

        notes[note.id] = note;

        this.props.screenProps.setState({notes: notes});
    }

    deleteNoteEdit(noteId) {
        let { notes } = this.props.screenProps;
        
        notes.splice(noteId, 1);
        this.updateNotesIds(notes);

        this.props.screenProps.setState({notes: notes});
    }

    addNote(categorieId) {
        this.props.navigation.navigate('Add', {
            saveNoteAdd: (note) => this.saveNoteAdd(note, categorieId),
        });
    }

    saveNoteAdd(note, categorieId) {
        let { notes } = this.props.screenProps;
        
        note.categorieId = categorieId;
        notes.push(note);
        this.updateNotesIds(notes);

        this.props.screenProps.setState({ notes: notes });
    }

    updateNotesIds(notes) {
        // put the ids
        notes.forEach((note, noteId) => (
            note.id = noteId
        ));
    }

    render() {
        if (this.props.screenProps.isLoading) {
            return (
                <View style={[Styles().cont, { flex: 1, justifyContent: 'center' }]}>
                    <ActivityIndicator size="large" color={StyleSheet.flatten(Styles().title).color} />
                </View>
            )
        }

        let { notes, categories } = this.props.screenProps;
        return (
            <ScrollView style={Styles().cont}>
                {categories.map((categorie, categorieId) => (
                    <NotesCategorie
                        key={categorieId}
                        title={categorie}
                        editNote={(note) => this.editNote(note)}
                        addNote={() => this.addNote(categorieId)}
                        notes={notes.filter(note => (
                            note.categorieId == categorieId
                        ))}
                    />
                ))}
            </ScrollView >
        );
    }
}
