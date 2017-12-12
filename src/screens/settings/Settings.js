import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, Button } from 'react-native';
import Styles from '../../styles/StyleSheet';
import ColorSets from '../../styles/ColorSets';

import { Notifications } from 'expo';

export default class Settings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            notificationToken: '',
        }
    }

    changeTheme(num){
      ColorSets.setTheme(num);
      this.props.screenProps.setState({themeNum:num});
    }

    async componentWillMount() {
        let token = await Notifications.getExpoPushTokenAsync();

        this.setState({ notificationToken: token });
    }

    render() {
        return (
            <View style={styles.cont}>
                <Text style={Styles().title}>Settings</Text>
                <Text style={Styles().txt}>{this.state.notificationToken}</Text>
              <Button title="Theme 1"
                color="black"
                onPress={()=>this.changeTheme(0)}/>
              <Button title="Theme 2"
                color="darkred"
                onPress={()=>this.changeTheme(1)}/>
              <Button title="Theme 3"
                color="indigo"
                onPress={()=>this.changeTheme(2)}/>
              <Button title="Theme 4"
                color="goldenrod"
                onPress={()=>this.changeTheme(3)}/>
              <Button title="Theme 5"
                color="palegreen"
                onPress={()=>this.changeTheme(4)}/>
              <Button title="Theme 6"
                color="teal"
                onPress={()=>this.changeTheme(5)}/>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: 'yellow',
        fontSize: 40,
        textAlign: 'center',
    },
    token: {
        color: 'yellow',
        textAlign: 'center',
    }
});

