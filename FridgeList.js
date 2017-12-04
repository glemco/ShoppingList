import React from 'react';
import { StyleSheet, Text, View, Alert, ScrollView,
        AsyncStorage, Button} from 'react-native';
import DeletableItem from './DeletableItem';

/*
 * Here is the fridge page, it retrieves the content of the fridge, 
 * (exactly as the shopping list does) and displays the content in 
 * DeletableItem.
 * The data2 static object is the list of items that are removed from
 * here and will be added to the shopping list
 */

const ITEM = 'fridge';

export default class FridgeList extends React.Component {

  constructor(props){
    console.log("Fridge start");
    super(props);
    this.state={data:{}};
    this.fetchData().done();
    FridgeList.data2 = {};
  }

  /*
   * When an element is deleted the user may want to add it directly
   * to the shopping list, here it is done (nothing happens if it was 
   * already there, may change if needed)
   */
  deleteItem(value){
    let tmp = this.state.data;
    delete tmp[value];
    Alert.alert( //will ask on direct deletion only
      "Delete item",
      "Would you like to buy "+value+"?\n"+
          "If you press Yes, Alfred will add it in your shopping list.",
      [
        {text:"Yes", onPress:()=>{FridgeList.data2[value]={name:value}
          this.props.changePos(value,"toBuy")}},
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
   */
  async fetchData(){
    try{
      var tmp = await AsyncStorage.getItem(ITEM);
      tmp = tmp?JSON.parse(tmp):{};
      Object.keys(this.props.updates())
        .forEach(e=>tmp[e]={name:e}); //apply needed modifications
      Object.keys(this.props.deletions()).forEach(e=>
        delete tmp[e]); //remove them
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
   * Put it back in memory
   */
  async storeData(){
    try{
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
   * Saving data to memory and sending modifications back to the
   * ShopList (it should be just below in the stack)
   */
  componentWillUnmount(){
    console.log("Fridge stop");
    this.storeData().done();
    this.props.sendBack(FridgeList.data2);
  }
}

const styles = StyleSheet.create({
  cont:{
    flex:1,
    backgroundColor:'azure',
  },
});
