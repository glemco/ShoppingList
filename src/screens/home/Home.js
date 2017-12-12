import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, Button } from 'react-native';
import Styles from '../../styles/StyleSheet';

import firebase from './../../service/Database';

export default class Home extends Component {
    render() {
        return (
            <View style={Styles().containerBackground}>
                <Image
                    style={{width: 300, height: 300}}
                    source={require('../../../assets/img/logo.png')}
                />
                <Text style={[Styles().title, styles.text]}>Alfred welcomes you !</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        fontSize: 40,
        textAlign: 'center',
    }
});

