import React from 'react';
import { StyleSheet, Text, View, TextInput, Alert,
        TouchableNativeFeedback} from 'react-native';

/*
 * Component used in the ShopList
 */

export default class EditableItem extends React.Component{

  /*
   * Set the state based on the props
   */
  constructor(props){
    super(props);
    this.state = {edit:false, text:this.props.text,tmp:this.props.text};
    if(this.props.active=='y')
      this.state.edit=true;
  }

  /*
   * When the ok button is pressed, it closes the editing and sends
   * the content of the TextInput to be saved in the list, if the element
   * contained already something, it will be changed to the new value
   * (change managed by the list by means of changeItem method)
   */
  sendChange(){
    this.props.onChange(this.props.propKey,this.state.tmp);
    this.setState({edit:false,text:this.state.tmp});
  }

  /*
   * When the delete button is pressed, here the editing phase is closed
   * and a dummy text is added but the element itself will be destroyed
   * since the element will be deleted from the list
   */
  delChange(){
    this.props.onChange(this.props.propKey); 
    this.setState({edit:false,text:"[deleted]"});
  }

  /*
   * When the done button is pressed, it happens in the idle mode and
   * it's just the same as above (just the method called from the props
   * is different) as the element will no more be in the list (moving 
   * to the fridge)
   */
  doneChange(){
    this.props.onDone(this.props.propKey); 
    this.setState({edit:false,text:"[done]"});
  }

  /*
   * Called when touching on the text while idle, it simply activates
   * the editing (bringing all the buttons)
   */
  editThis(){
    this.setState(prev=>{return {edit:true,tmp:prev.text}});
    this.props.closeOthers(this.props.propKey);
  }

  /*
   * The component is rendered based on the state (editing or not) and
   * on the content (whether is empty), wile editing there's a big
   * TextInput and on the right the two buttons for ok and delete
   * (the first is there only if there's input, the second only when 
   * editing elements, not in the $new). When the element is idle,
   * the done button is on the left (excluding the $new element) and
   * the text on the right (in case of $new a placeholder is added
   */
  render(){
    return this.state.edit ? (
        <View style={styles.editItem}>
          <TextInput
            value={this.state.tmp}
            placeholder="Add new item"
            onChangeText={val=>this.setState({tmp:val})}
            autoFocus={true}
            style={{flex:1}}
          />
          {this.state.tmp.length ? //can't submit empty
          (<TouchableNativeFeedback
            onPress={this.sendChange.bind(this)}>
            <Text style={{width:'6%',padding:2}}>ok</Text>
          </TouchableNativeFeedback>):null}
          {this.state.text.length ? //can't delete new one
          (<TouchableNativeFeedback
            onPress={this.delChange.bind(this)}>
            <Text style={{width:'6%',padding:2}}>x</Text>
          </TouchableNativeFeedback>):null}
        </View> 
      ) : (
        <View style={styles.steadyItem}>
          {this.state.text.length ? //can't delete new one
            (<TouchableNativeFeedback
              onPress={this.doneChange.bind(this)}>
              <Text style={{width:'6%',padding:2}}>D</Text>
            </TouchableNativeFeedback>):null}
          <TouchableNativeFeedback 
            onPress={this.editThis.bind(this)}>
            <View style={{flex:1}}>
              <Text>
                {this.state.text?this.state.text:"Add new item"}
              </Text>
            </View>
          </TouchableNativeFeedback> 
        </View>
      );
  }
}

const styles = StyleSheet.create({
  steadyItem:{
    height:30,
    padding:4,
    backgroundColor:"gray",
    flexDirection:'row',
  },
  editItem:{
    height:30,
    padding:2,
    backgroundColor:"royalblue",
    flexDirection:'row',
  },
});
