import React from 'react';
import { StyleSheet, Text, View, Alert, ScrollView,
        TextInput, TouchableNativeFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './StyleSheet.js';

/*
 * This list takes from the main one what Alfred thinks may be a useful
 * advice to put in the shopping list, it takes only items that are not
 * in the shopping list already (position:{none|fridge}) and display
 * them only if the duration is closed to the current date - the last 
 * saved (statistically it's time to buy them)
 */
export default class SuggList extends React.Component{

  /*
   * data is what will be added to the ShopList
   */
  constructor(props){
    super(props);
    this.state={data:{}};
  }

  /*
   * Called when selecting an element, if the element is in the fridge,
   * it also asks to remove it from there, in any case it sends it to
   * be added and it updates it's position
   */
  addElement(value,isFridge){
    var tmp = this.state.data;
    tmp[value]={name:value};
    this.props.changePos(value,"toBuy");
    if(isFridge){
      Alert.alert(
        "Element from the fridge",
        "Alfred still thinks "+value+" is in the fridge\n"+
        "Are you running out of it?\n"+
        "If you press Yes, Alfred will remove it from the fridge list",
      [
        {text:"Yes", onPress:()=>this.props.sendRem(value)},
        {text: "No", onPress:()=>this.props.changePos(value,"both")},
      ]
      );
    }
    this.setState({data:tmp});
    this.props.sendBack(value); //send each time
  }

  /*
   * Here all the element (properly filtered) are displayed in a 
   * TouchableNativeFeedback element that calls the addElement on press,
   * passing also if the element was in the fridge
   */
  render(){
    return <View style={styles.cont}>
    <ScrollView>
      {Object.keys(this.props.data)
        .filter(e=>(new Date()-this.props.data[e].lastDate)>
          this.props.data[e].duration)
        .filter(e=>(!this.state.data[e]))
        .filter(e=>(this.props.data[e].position=="none" || 
          this.props.data[e].position=="fridge"))
        .map(e=>(<View style={styles.item} key={e}>
          <TouchableNativeFeedback
            onPress={()=>this.addElement(e,
              this.props.data[e].position=="fridge")}>
            <View style={{flexDirection:"row"}}>
              <Icon name="add-shopping-cart" style={styles.icon}/>
              <Text>{e}</Text>
            </View>
          </TouchableNativeFeedback></View>))}
      </ScrollView>
    </View>;
  }
}
