import React from 'react';
import { Platform, StatusBar, StyleSheet, } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Styles from '../styles/StyleSheet';

import Notes from '../screens/notes/Notes';
import Add from '../screens/notes/Add';
import Edit from '../screens/notes/Edit';

export default NotesStack = StackNavigator({
    Notes: {
        screen: Notes,
        navigationOptions: {
            title: 'Notes',
            header: null
        }
    },
    Add: {
        screen: Add,
        navigationOptions: {
            title: 'Add'
        }
    },
    Edit: {
        screen: Edit,
        navigationOptions: {
            title: 'Edit'
        }
    },
}, {
    navigationOptions: ()=>({
        headerTintColor: StyleSheet.flatten(Styles().title).color,
        headerStyle: {
            backgroundColor: StyleSheet.flatten(Styles().bar).backgroundColor,
            paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
        }
    })
});
