import React from 'react';
import { Text, View, TouchableNativeFeedback} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './StyleSheet.js';

/*
 * Component used in the FridgeList
 */

export default class DeletableItem extends React.Component{

  constructor(props){
    super(props);
    this.state = {text:this.props.text,tmp:this.props.text};
  }

  delChange(){
    this.props.onDelete(this.props.propKey); 
    this.setState({text:"[deleted]"});
  }

  /*
   * All the same as EditableItem but there's no edit capability and
   * just the delete button that triggers the deleteItem in the fridge
   */
  render(){
    return (
        <View style={styles().item}>
          <Text style={[styles().txt,{flex:1}]}>{this.state.text}</Text>
          <TouchableNativeFeedback
            onPress={this.delChange.bind(this)}>
            <MaterialIcons name="delete-sweep" style={styles().icon}/>
          </TouchableNativeFeedback>
        </View>);
  }
}
