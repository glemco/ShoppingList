import React from 'react';
import { TouchableOpacity, TouchableNativeFeedback, 
      Platform, View, } from 'react-native';

var TouchableComponent;
if (Platform.OS === 'android')
  TouchableComponent=Platform.Version<=20?
    TouchableOpacity : TouchableNativeFeedback;
else
  TouchableComponent = TouchableOpacity;

export default class Touchable extends React.Component{

  render(){
    let {
      children,
      ...props
    } = this.props;

    return <TouchableComponent {...props}>
            {children}
          </TouchableComponent>;
  }
}
