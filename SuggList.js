import React from 'react';
import { Text, View, Alert, ScrollView, } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Touchable from './Touchable';
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
   * data is what will be added to the ShopList, items are received
   */
  constructor(props){
    super(props);
    this.state={data:{},items:this.props.data()};
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
   * Touchable element that calls the addElement on press,
   * passing also if the element was in the fridge
   */
  render(){
    return <View style={styles().cont}>
    <ScrollView>
      {Object.keys(this.state.items)
        .filter(e=>(new Date()-this.state.items[e].lastDate)>
          this.state.items[e].duration)
        .filter(e=>(!this.state.data[e]))
        .filter(e=>(this.state.items[e].position=="none" || 
          this.state.items[e].position=="fridge"))
        .map(e=>(<View style={styles().item} key={e}>
          <Touchable
            onPress={()=>this.addElement(e,
              this.state.items[e].position=="fridge")}>
            <View style={{flexDirection:"row"}}>
              <MaterialIcons name="add-shopping-cart"
                style={styles().icon}/>
              <Text style={styles().txt}>{e}</Text>
            </View>
          </Touchable></View>))}
      </ScrollView>
    </View>;
  }
}
