import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { StackNavigator } from 'react-navigation';

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
    navigationOptions: {
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: 'black',
            paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
        }
    }
});