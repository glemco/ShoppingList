
import React from 'react';
import { Text, View, Modal, TextInput,
  ScrollView, TouchableWithoutFeedback, } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Touchable from './Touchable';
import styles from './StyleSheet.js';

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

  closeIt(){
    this.props.onClose();
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
      <TouchableWithoutFeedback onPress={this.closeIt.bind(this)}>
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
                <Touchable key={i}
                  onPress={()=>this.setState({selected:e})}>
                  <View style={[styles().item,styles().itemSmall]}>
                    <MaterialCommunityIcons name={this.state.selected==e?
                        "radiobox-marked":"radiobox-blank"}
                      style={styles().icon}/>
                    <Text style={styles().txt}>{e}</Text>
                  </View>
                </Touchable>)}
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
                <Touchable 
                  onPress={this.closeIt.bind(this)}>
                  <Text style={styles().modButt}>
                    CANCEL
                  </Text>
                </Touchable>
                <Touchable 
                  onPress={this.sendData.bind(this)}>
                  <Text style={styles().modButt}>
                    OK
                  </Text>
                </Touchable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  }

}
