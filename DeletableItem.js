import React from 'react';
import { StyleSheet, Text, View, 
        Alert, TouchableNativeFeedback} from 'react-native';

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
        <View style={styles.item}>
          <Text style={{flex:1}}>{this.state.text}</Text>
          <TouchableNativeFeedback
            onPress={this.delChange.bind(this)}>
            <Text style={{width:'6%',padding:2}}>x</Text>
          </TouchableNativeFeedback>
        </View>);
  }
}

const styles = StyleSheet.create({
  item:{
    height:30,
    padding:4,
    backgroundColor:"salmon",
    flexDirection:'row',
  },
});
