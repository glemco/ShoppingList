import React from 'react';
import { StyleSheet, Text, View, ScrollView,
        AsyncStorage, Button, AppState,} from 'react-native';
import {StackNavigator,} from 'react-navigation';
import styles from './StyleSheet.js';
import ShopList from './ShopList';
import FridgeList from './FridgeList';
import SuggList from './SuggList';

/*
 * List.data is a static attribute accessible through functions
 * It has 1 field for each item (accessible through it's name)
 * and each field has name,duration(days),lastDate(ms) 
 * and position {none,toBuy,fridge,both}
 */

class TestMain extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return <View><ScrollView>{Object.keys(this.props.items)
      .map(e=><Text key={e}>{e+"\t"+
        this.props.items[e].position+"\t"+
        this.props.items[e].duration/1000+"\t"+
        (new Date(this.props.items[e].lastDate)).getMinutes()+"."+
        (new Date(this.props.items[e].lastDate)).getSeconds()}
        </Text>)}</ScrollView></View>;
  }
}

const ITEM = 'mainList';
const DAY = 86400*1000; //in ms
const AVG_SET = .25; //sets importance of new value in average
//const AVG_SET = 1; //recomputes each time (100% on new value)

/*
 * As it happens in the shopping list this function can both add and 
 * delete, in case of a change the old value is directly deleted and
 * its data is saved in the new entry if not already there (otherwise the 
 * default behaviour applies), when an element that was already
 * there is added it's data are updated: the last date is set to the
 * current, the duration (in ms) is computed as an average between 
 * the old duration and the new one (new date-last date), the relative 
 * weight can be tuned.
 * The default duration should be something like 1 or 2 weeks (deps on
 * statistics) here it's 0 for testing purposes
 */
function changeItem(oldVal,newVal){
  if(oldVal==newVal) //no change
    return;
  List.saved=false; //something changed
  if(newVal && newVal.length){ //otherwise it's just a deletion
    if(List.data[newVal]){ //already in
      List.data[newVal].duration = 
        (1-AVG_SET)*List.data[newVal].duration +
        AVG_SET*(new Date()-List.data[newVal].lastDate);
      List.data[newVal].lastDate = (new Date()).getTime(); //update stats
    } else {
      if(oldVal.length && oldVal!="$new"){
        List.data[newVal] = List.data[oldVal]; //merge them
        List.data[newVal].name = newVal; //update
        delete List.data[oldVal]; //no more needed
      } else //default duration should be much more than 0
        List.data[newVal] = {name:newVal,duration:0,
          lastDate:(new Date()).getTime(),position:"toBuy"};
    }
  } else
    delete List.data[oldVal];
}

/*
 * Passed to any component that may need it, it's a simple setter for
 * the positio (fridge, toBuy, etc)
 */
function changePos(name,newPos){
  List.saved=false; //something changed
  List.data[name].position = newPos;
}

/*
 * As above but a getter (used to make the 'both' position possible
 */
function getPos(name){
  if(!List.data[name])
    return null;
  return List.data[name].position;
}

const Nav = StackNavigator({
  Shop: {
    screen: ({navigation})=>(<ShopList
                    onChange={changeItem}
                    changePos={changePos}
                    getPos={getPos}
                    navigation={navigation}
                  />),
    navigationOptions:({navigation})=> ({ 
      headerTitle: "Shopping List",
      headerStyle: styles.bar,
      headerRight: ShopList.navigationOptions.headerRight,
    }),
  },
  Fridge: {
    screen: ({navigation})=>(<FridgeList
              updates={ShopList.getData2}
              deletions={ShopList.getRem2}
              sendBack={ShopList.receiveItem}
              changePos={changePos}
              getPos={getPos}
              navigation={navigation}
            />),
    navigationOptions: { 
      headerTitle: "Fridge List",
      headerStyle: styles.bar,
    },
  },
  Sugg: {
    screen: ({navigation})=>(<SuggList
              data={List.data}
              sendBack={ShopList.receiveItem}
              sendRem={ShopList.sendRemItem}
              changePos={changePos}
              navigation={navigation}
            />),
    navigationOptions: { 
      headerTitle: "Suggestions List",
      headerStyle: styles.bar,
    },
  },
  Test: {
    screen: ()=>(<TestMain items={List.data}/>),
  },
});

export default class List extends React.Component {

  constructor(props){
    super(props);
    List.data={};
    List.saved=true;
    this.fetchData().done();
  }

  componentWillMount(){
    AppState.addEventListener('change', state => {
      if(state!="active")
        List.storeData().done(); //saves on close
    });
  }

  /*
   * As ShopList or FridgeList, the only different is that this attribute
   * can be static since it's not used to render (this component is just
   * a StackNavigator)
   */
  async fetchData(){
    try{
      var tmp = await AsyncStorage.getItem(ITEM);
      List.data=tmp?JSON.parse(tmp):{};
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
   * As usual
   */
  static async storeData(){
    try{
      if(List.saved)
        return;
      console.log("Saving mainList");
      await AsyncStorage.setItem(ITEM,JSON.stringify(List.data));
    } catch(e){
      Alert.alert(
        'Error',
        'An error occurred while loading the content',
        [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'Retry', onPress: () => console.log('Retry Pressed')},
        ],
        {cancelable:false}
      );
    }
  }

  render(){
    return <Nav />;
  }

  /*
   * As usual
   */
  componentWillUnmount(){
    List.storeData().done();
  }
}
