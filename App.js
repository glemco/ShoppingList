import React, { Component } from 'react';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import Styles from './src/styles/StyleSheet';

import registerForPushNotificationsAsync from './src/api/registerForPushNotificationsAsync';

import firebase from './src/service/Database';

import NavTabs from './src/navigation/NavTabs';

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            notes: [],
            isLoading: true,
            loaded:false,
            categories: [],
            settings: {
                theme: null
            }
        }
    }

    render() {
        const screenProps = {
            ...this.state,
            setState: (data) => this.setState(data)
        }
        var Nav=NavTabs();
        return (this.state.loaded?
            <View style={[Styles().tabBar,styles.container]}>
                <Nav screenProps={screenProps} />
            </View>:<View/>
        )
    }

    componentDidMount() {
        registerForPushNotificationsAsync();
        this.getData();
        setTimeout(()=>this.setState({loaded:true}),100);
    }

    getData() {
        firebase.database().ref().on('value', data => {
            this.setState(state => {
                state = data.val();

                // put the ids
                state.notes.forEach((note, noteId) => (
                    note.id = noteId
                ));

                state.isLoading = false;
                return state;
            });
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    }
});
