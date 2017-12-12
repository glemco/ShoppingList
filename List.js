import React from 'react';
import { Text, View, ScrollView, StyleSheet,
        AsyncStorage, AppState,} from 'react-native';
import {StackNavigator,} from 'react-navigation';
import styles from './StyleSheet.js';
import ShopList from './ShopList';
import FridgeList from './FridgeList';
import SuggList from './SuggList';
import ColorSets from './ColorSets';

/*
 * data is a local attribute accessible through some static functions
 * It has 1 field for each item (accessible through it's name)
 * and each field has name,duration(days),lastDate(ms) 
 * and position {none,toBuy,fridge,both}
 */

class TestMain extends React.Component{
  constructor(props){
    super(props);
    this.state={items:this.props.items()};
  }

  render(){
    return <View><ScrollView>{Object.keys(this.state.items)
      .map(e=><Text key={e}>{e+"\t"+
        this.state.items[e].position+"\t"+
        this.state.items[e].duration/1000+"\t"+
        (new Date(this.state.items[e].lastDate)).getMinutes()+"."+
        (new Date(this.state.items[e].lastDate)).getSeconds()}
        </Text>)}</ScrollView></View>;
  }
}

const ITEM = 'mainList';
const DAY = 86400*1000; //in ms
const AVG_SET = .25; //sets importance of new value in average

const Nav = StackNavigator({
  Shop: {
    screen: ({navigation})=>(<ShopList
                    onChange={List.changeItem}
                    changePos={List.changePos}
                    getPos={List.getPos}
                    refreshList={List.refreshData}
                    navigation={navigation}
                  />),
    navigationOptions:({navigation})=> ({ 
      headerTitle: "Shopping List",
      headerStyle: styles().bar,
      headerTitleStyle: styles().barText,
      headerRight: ShopList.navigationOptions().headerRight,
      headerTintColor: StyleSheet.flatten(styles().title).color,
    }),
  },
  Fridge: {
    screen: ({navigation})=>(<FridgeList
              updates={ShopList.getData2}
              deletions={ShopList.getRem2}
              sendBack={ShopList.receiveItem}
              changePos={List.changePos}
              getPos={List.getPos}
              navigation={navigation}
            />),
    navigationOptions: ()=>({ 
      headerTitle: "Fridge List",
      headerStyle: styles().bar,
      headerTitleStyle: styles().barText,
      headerTintColor: StyleSheet.flatten(styles().title).color,
    }),
  },
  Sugg: {
    screen: ({navigation})=>(<SuggList
              data={List.getData}
              sendBack={ShopList.receiveItem}
              sendRem={ShopList.sendRemItem}
              changePos={List.changePos}
              navigation={navigation}
            />),
    navigationOptions: ()=>({ 
      headerTitle: "Suggestions List",
      headerStyle: styles().bar,
      headerTitleStyle: styles().barText,
      headerTintColor: StyleSheet.flatten(styles().title).color,
    }),
  },
  Test: {
    screen: ()=>(<TestMain items={List.getData}/>),
  },
});

export default class List extends React.Component {

  constructor(props){
    super(props);
    this.data={};
    this.rem={};
    this.saved=true;
    List.changeItem=this.changeItem.bind(this);
    List.changePos=this.changePos.bind(this);
    List.getPos=this.getPos.bind(this);
    List.getData=this.getData.bind(this);
    List.refreshData=this.refreshData.bind(this);
    this.fetchData().done();
  }

  /*
   * See ShopList
   */
  componentWillMount(){
    AppState.addEventListener('change', state => {
      if(state!="active")
        this.storeData().done(); //saves on close
    });
  }

  /*
   * As it happens in the shopping list this can both add and 
   * delete, in case of a change the old value is directly deleted and
   * its data is saved in the new entry if not already there (otherwise
   * the default behaviour applies), when an element that was already
   * there is added it's data are updated: the last date is set to the
   * current, the duration (in ms) is computed as an average between 
   * the old duration and the new one (new date-last date), the relative 
   * weight can be tuned.
   * The default duration should be something like 1 or 2 weeks (deps on
   * statistics) here it's 0 for testing purposes
   */
  changeItem(oldVal,newVal){
    if(oldVal==newVal) //no change
      return;
    this.saved=false; //something changed
    if(newVal && newVal.length){ //otherwise it's just a deletion
      if(this.data[newVal]){ //already in
        this.data[newVal].duration = 
          (1-AVG_SET)*this.data[newVal].duration +
          AVG_SET*(new Date()-this.data[newVal].lastDate);
        this.data[newVal].lastDate=(new Date()).getTime(); //update stats
      } else {
        if(oldVal.length && oldVal!="$new"){
          this.data[newVal] = this.data[oldVal]; //merge them
          this.data[newVal].name = newVal; //update
          delete this.data[oldVal]; //no more needed
        } else //default duration should be much more than 0
          this.data[newVal] = {name:newVal,duration:0,
            lastDate:(new Date()).getTime(),position:"toBuy"};
      }
    } else {
      delete this.data[oldVal];
      this.rem[oldVal]={}; //used while refreshing
    }
  }

  /*
   * Passed to any component that may need it, it's a simple setter for
   * the position (fridge, toBuy, etc)
   */
  changePos(name,newPos){
    this.saved=false; //something changed
    this.data[name].position = newPos;
  }

  /*
   * As above but a getter (used to make the 'both' position possible
   */
  getPos(name){
    if(!this.data[name])
      return null;
    return this.data[name].position;
  }

  /*
   * For who needs to access that list
   */
  getData(){
    return this.data;
  }

  /*
   * As ShopList or FridgeList
   */
  async fetchData(){
    try{
      var tmp = await AsyncStorage.getItem(ITEM);
      this.data=tmp?JSON.parse(tmp):{};
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
  async storeData(){
    try{
      if(this.saved)
        return;
      await AsyncStorage.setItem(ITEM,JSON.stringify(this.data));
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
   * Called by pulling down the ShopList, it does exactly the same for
   * this object (needs static reference)
   */
  async refreshData(){
    var tmp = await AsyncStorage.getItem(ITEM);
    tmp = tmp?JSON.parse(tmp):{}; 
    if(tmp!=this.data){ //something changed
      this.data = Object.assign(tmp,this.data); //merge them
      Object.keys(this.rem)
        .forEach(e=>delete this.data[e]); //apply removals
      this.rem={}; //removals have been saved
      this.saved=false;
    }
    this.storeData();
  }


  /*
   * As usual
   */
  componentWillUnmount(){
    this.storeData().done();
  }
}
