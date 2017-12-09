
import React from 'react';
import { Text, View, Modal, TextInput, 
  TouchableNativeFeedback, StyleSheet,
  ScrollView, TouchableWithoutFeedback, } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './StyleSheet.js';

export default class ModalSelector extends React.Component{
  constructor(props){
    super(props);
    this.state={open:this.props.isVisible};
  }

  componentWillReceiveProps(newProps){
    this.setState({open:newProps.isVisible,selected:undefined});
  }

  sendData(){
    let val=this.state.selected=="$other"?
      this.state.other:this.state.selected;
    this.props.onSubmit(val);
    this.setState({open:false});
  }

  render(){
    return <Modal onRequestClose={() => null} animationType="fade" 
      visible={this.state.open} transparent={true}>
      <TouchableWithoutFeedback onPress={()=>this.setState({open:false})}>
        <View style={modStyles.modBack}>
          <TouchableWithoutFeedback onPress={()=>null}>
            <View style={modStyles.modCont}>
              <View style={modStyles.modHead}>
                <Text style={styles.title}>
                  Which ingredient would you like to add?
                </Text>
              </View>
              <ScrollView style={{height:300}}>
                {this.props.items.map((e,i)=>
                <TouchableNativeFeedback key={i}
                  onPress={()=>this.setState({selected:e})}>
                  <View style={[styles.item,styles.itemSmall]}>
                    <Icon name={this.state.selected==e?
                        "radiobox-marked":"radiobox-blank"}
                      style={styles.icon}/>
                    <Text>{e}</Text>
                  </View>
                </TouchableNativeFeedback>)}
                <View style={[styles.item,styles.itemSmall]}>
                  <Icon name={this.state.selected=="$other"?
                      "radiobox-marked":"radiobox-blank"}
                    style={styles.icon}/>
                  <TextInput placeholder="Other" style={{flex:1}} 
                    value={this.state.selected}
                    onFocus={()=>this.setState({selected:"$other"})}
                    onChangeText={txt=>this.setState({other:txt})}/>
                </View>
              </ScrollView>
              <View
                style={modStyles.modFoot}>
                <TouchableNativeFeedback 
                  onPress={()=>this.setState({open:false})}>
                  <Text style={modStyles.modButt}>
                    CANCEL
                  </Text>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback 
                  onPress={this.sendData.bind(this)}>
                  <Text style={modStyles.modButt}>
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

const modStyles = StyleSheet.create({
  modButt:{
    padding:10,
    color:"blue",
    fontWeight:"bold",
    paddingBottom:7,
  },
  modCont:{
    margin:30,
    backgroundColor:"white",
    padding:7,
  },
  modHead:{
    borderBottomWidth:1,
    padding:7,
    borderBottomColor:"lightgray",
    marginBottom:5,
  },
  modFoot:{
    flexDirection:"row",
    justifyContent:"flex-end",
    borderTopWidth:1,
    borderTopColor:"lightgray"
  },
  modBack:{
    backgroundColor:"rgba(0,0,0,.7)",
    flex:1,
    justifyContent:"center",
  },
});
