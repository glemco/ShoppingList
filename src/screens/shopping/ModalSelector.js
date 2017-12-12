
import React from 'react';
import { Text, View, Modal, TextInput, 
  TouchableNativeFeedback, StyleSheet,
  ScrollView, TouchableWithoutFeedback, } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles from './../../styles/StyleSheet.js';

export default class ModalSelector extends React.Component{
  constructor(props){
    super(props);
    this.state={open:this.props.isVisible};
  }

  /*
   * Change the state when props get updated (to be able to manage it 
   * in here too
   */
  componentWillReceiveProps(newProps){
    this.setState({open:newProps.isVisible,selected:undefined});
  }

  /*
   * select the data to send and call the submit method, if the textbox 
   * is selected, it's content will be sent instead
   */
  sendData(){
    let val=this.state.selected=="$other"?
      this.state.other:this.state.selected;
    this.props.onSubmit(val);
    this.setState({open:false});
  }

  /*
   * Modal structure with touchable area outside to close it, touchable
   * inside to ensure it won't close (basically it's doing nothing but 
   * getting touches), a title in the top, the list with radio-like
   * buttons and a textbox in the end and finally the 2 buttons to submit
   * and close 
   */
  render(){
    return <Modal onRequestClose={() => null} animationType="fade" 
      visible={this.state.open} transparent={true}>
      <TouchableWithoutFeedback onPress={()=>this.setState({open:false})}>
        <View style={styles().modBack}>
          <TouchableWithoutFeedback onPress={()=>null}>
            <View style={styles().modCont}>
              <View style={styles().modHead}>
                <Text style={styles().title}>
                  Which ingredient would you like to add?
                </Text>
              </View>
              <ScrollView style={{height:300}}>
                {this.props.items.map((e,i)=>
                <TouchableNativeFeedback key={i}
                  onPress={()=>this.setState({selected:e})}>
                  <View style={[styles().item,styles().itemSmall]}>
                    <MaterialCommunityIcons name={this.state.selected==e?
                        "radiobox-marked":"radiobox-blank"}
                      style={styles().icon}/>
                    <Text style={styles().txt}>{e}</Text>
                  </View>
                </TouchableNativeFeedback>)}
                <View style={[styles().item,styles().itemSmall]}>
                  <MaterialCommunityIcons 
                    name={this.state.selected=="$other"?
                      "radiobox-marked":"radiobox-blank"}
                    style={styles().icon}/>
                  <TextInput placeholder="Other"
                    style={[styles().txt,{flex:1}]} 
                    onFocus={()=>this.setState({selected:"$other"})}
                    autoCapitalize="none"
                    onChangeText={txt=>this.setState({other:txt})}/>
                </View>
              </ScrollView>
              <View
                style={styles().modFoot}>
                <TouchableNativeFeedback 
                  onPress={()=>this.setState({open:false})}>
                  <Text style={styles().modButt}>
                    CANCEL
                  </Text>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback 
                  onPress={this.sendData.bind(this)}>
                  <Text style={styles().modButt}>
                    OK
                  </Text>
                </TouchableNativeFeedback>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  }

}
