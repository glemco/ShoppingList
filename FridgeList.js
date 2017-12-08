import React from 'react';
import { StyleSheet, Text, View, Alert, ScrollView,
        AsyncStorage, Button, AppState,} from 'react-native';
import DeletableItem from './DeletableItem';
import styles from './StyleSheet.js';

/*
 * Here is the fridge page, it retrieves the content of the fridge, 
 * (exactly as the shopping list does) and displays the content in 
 * DeletableItem.
 * After an object is deleted it's sent to the ShopList to be added
 * (if the user selected such option)
 */

const ITEM = 'fridge';

export default class FridgeList extends React.Component {

  constructor(props){
    //console.log("Fridge start");
    super(props);
    this.state={data:{}};
    this.fetchData().done();
    this.saved=true;
  }

  /*
   * To save data on close
   */
  componentWillMount(){
    AppState.addEventListener('change', state => {
      if(state!="active"){
        this.storeData().done(); //saves on close
      }
    });
  }

  /*
   * When an element is deleted the user may want to add it directly
   * to the shopping list, here it is done (nothing happens if it was 
   * already there, may change if needed)
   */
  deleteItem(value){
    let tmp = this.state.data;
    this.saved=false; //something has changed
    delete tmp[value];
    Alert.alert( //will ask on direct deletion only
      "Delete item",
      "Would you like to buy "+value+"?\n"+
          "If you press Yes, Alfred will add it in your shopping list.",
      [
        {text:"Yes", onPress:()=>{this.props.changePos(value,"toBuy")
          this.props.getPos(value)=="both"?
            null:this.props.sendBack(value)}},
        {text: "No", onPress:()=>this.props.getPos(value)=="both"?
            this.props.changePos(value,"toBuy"):
            this.props.changePos(value,"none")},
      ]
    );
    this.setState({data:tmp}); //this will reload
  }

  /*
   * Fetching data from local storage, after it apply the modifications
   * that have beed passed by the ShopList (additions and deletions)
   * Change the saved flag only if adding/removing something
   */
  async fetchData(){
    try{
      var tmp = await AsyncStorage.getItem(ITEM);
      tmp = tmp?JSON.parse(tmp):{};
      Object.keys(this.props.updates()).forEach(e=>
          {this.saved=false; tmp[e]={name:e}}); //add items
      Object.keys(this.props.deletions()).forEach(e=>
        {this.saved=false; delete tmp[e]}); //remove them
      console.log("Retrieving fridge");
      this.setState({data:tmp,focus:true});
    } catch(e){
      Alert.alert(
        'Error',
        'An error occurred while loading the content',
        [
          {text: 'Cancel', onPress: () => console.log(e), style: 'cancel'},
          {text: 'Retry', onPress: () => console.log('Retry Pressed')},
        ],
        {cancelable:false}
      );
    }
  }

  /*
   * Put it back in memory (if there's something new)
   */
  async storeData(){
    try{
      if(this.saved)
        return;
      console.log("Saving FridgeList");
      await AsyncStorage.setItem(ITEM,JSON.stringify(this.state.data));
    } catch(e){
      Alert.alert(
        'Error',
        'An error occurred while saving the content',
        [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'Retry', onPress: () => console.log('Retry Pressed')},
        ],
        {cancelable:false}
      );
    }
  }

  /*
   * All elements are rendered with properties and methods
   */
  render(){
    return <View style={styles.cont}>
      <ScrollView>
        {Object.keys(this.state.data)
          .map((item) => (<DeletableItem 
            key={item+(new Date()).getTime()}
            propKey={item}
            text={this.state.data[item].name}
            onDelete={this.deleteItem.bind(this)}/>))}
      </ScrollView>
    </View>;
  }

  /*
   * Saving data to memory while unmounting
   */
  componentWillUnmount(){
    //console.log("Fridge stop");
    this.storeData().done();
  }
}
