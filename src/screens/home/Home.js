import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, Button } from 'react-native';
import Styles from '../../styles/StyleSheet';
import colors from '../../styles/ColorSets';

import firebase from './../../service/Database';

const logos = [
  require('../../../assets/img/logo0.png'),
  require('../../../assets/img/logo1.png'),
  require('../../../assets/img/logo2.png'),
  require('../../../assets/img/logo3.png'),
  require('../../../assets/img/logo4.png'),
  require('../../../assets/img/logo5.png'),
];

export default class Home extends Component {
    render() {
        return (
            <View style={Styles().containerBackground}>
                <Image
                    style={{width: 300, height: 300}}
                    source={logos[colors.index]}
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

