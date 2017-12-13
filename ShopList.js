import React from 'react';
import { Text, View, Alert, TouchableWithoutFeedback,
        AsyncStorage, Button, Animated, Dimensions,
        AppState, RefreshControl, StyleSheet,
        ScrollView, Keyboard} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Touchable from './Touchable';
import styles from './StyleSheet.js';
import EditableItem from './EditableItem';

/*
 * In here the actual shopping list is displayed, it should be the 
 * first frame of a stack navigator, with a button on the left of
 * the header that links to the fridge and another button in the 
 * bottom to see suggested items to add.
 * The list object is in state.data, it's retrieved during the creation
 * of the component (constructor) and is saved back to memory during
 * unmount. Additional objects are data2 and rem2 which are static,
 * since they are not used to render the list and this way are easier
 * to pass to other components, indeed they are respectively what should
 * be added and removed from the fridge.
 * The list object has an entry for each element, addressable by just
 * the name (should use an hash direct access) and contains a name field
 * (if needed to be retrieved in some way)
 */

const ITEM = 'toBuy';
const BUTT_HEIGHT = 140;

export default class ShopList extends React.Component {

  /*
   * Here I'm initializing some static functions with methods,
   * it may not be the cleanest way but, since I know I have just 
   * one occurrence of the object (that should always be there while
   * needed), I can call them easily from everywhere else in the stack
   */
  constructor(props){
    super(props);
    this.state={data:{}};
    this.fetchData().done();
    this.keyboardHeight = new Animated.Value(0);
    this.saved=true;
    this.rem = {};
    ShopList.data2 = {};
    ShopList.rem2 = {};
    ShopList.navigate = this.props.navigation.navigate.bind(this);
    ShopList.receiveItem = this.receiveItem.bind(this);
  }

  /*
   * These are used to get the keyboard event, on IOS the keyboardWill*
   * event should work better, but it's not there for Android.
   * The AppState listener is used to call the saving to storage
   * method when the app changes state (usually when it's closing)
   * since the component is not unmounting and may lose data otherwise
   */
  componentWillMount(){
    this.keyboardDidShowLsnr = Keyboard.addListener('keyboardDidShow',
      this.keyboardDidShow);
    this.keyboardDidHideLsnr = Keyboard.addListener('keyboardDidHide',
      this.keyboardDidHide);
    AppState.addEventListener('change', state => {
      if(state!="active")
        this.storeData().done(); //saves on close
    });
  }

  /*
   * Just set the height of a View to follow the keyboard in order
   * to shift the content and let the TextInput visible while editing
   */
  keyboardDidShow = (event)=>{
    Animated.timing(
      this.keyboardHeight,{
        toValue:
          Dimensions.get('window').height
          -event.endCoordinates.height-BUTT_HEIGHT,
        duration:100,
      }
    ).start();
  };

  /*
   * Restore it to 0
   */
  keyboardDidHide = (event)=>{
    Animated.timing(
      this.keyboardHeight,{
        toValue:0,
        duration:100,
      }
    ).start();
  };

  /*
   * Define the header button that leads to the fridge
   */
  static navigationOptions(){
    return {
      headerRight:(<Touchable
            onPress={()=>ShopList.navigate("Fridge")}>
            <MaterialCommunityIcons name="fridge" style={[styles().icon,{fontSize:30}]}/>
          </Touchable>),
    };
  }

  /*
   * This is called when an EditableItem has been edited, with both 
   * arguments change from one to the other, otherwise it can just add
   * or just delete.This method is also passing data to the main list 
   * (through methods inside its props), so adding, deleting and changing 
   * the position flag in there. Direct deletion has prompt to ask, while 
   * changing from a value to another the old one is deleted directly and 
   * the new element takes its place and values (can be changed)
   */
  changeItem(oldVal,newVal){
    let tmp = this.state.data;
    if(oldVal==newVal)
      return;
    this.saved=false; //something has changed
    delete tmp[oldVal];
    this.rem[oldVal] = {}; //used in the pull-to-refresh
    if(newVal && newVal.length){ //otherwise it's just a deletion
      tmp[newVal] = {name:newVal};
      this.props.onChange(oldVal,newVal);
      if(this.props.getPos(newVal)=="fridge")
        this.props.changePos(newVal,"both");
      else
        this.props.changePos(newVal,"toBuy");
    } else
      Alert.alert( //will ask on direct deletion only
        "Delete item",
        "Would you buy "+oldVal+" in the future?\n"+
            "If you press No Alfred will forget about it.",
        [
          {text:"Yes", onPress:()=>this.props.getPos(oldVal)=="both"?
            this.props.changePos(oldVal,"fridge"):
            this.props.changePos(oldVal,"none")},
          {text:"No", onPress:()=>{this.props.getPos(oldVal)=="both"?
            ShopList.sendRemItem(oldVal):null;
            this.props.onChange(oldVal)}},
        ]
      );
    this.setState({data:tmp}); //this will reload
  }

  /*
   * When this is called an element is removed from the current list and
   * added to the temporary object storing what will be added to the 
   * fridge
   */
  sendItem(value){
    let tmp = this.state.data;
    this.saved=false; //something has changed
    delete tmp[value];
    ShopList.data2[value] = {name:value}; //what to add to the fridge
    this.props.changePos(value,"fridge"); //moving
    this.setState({data:tmp});
  }

  /*
   * The same as above but for removals from the fridge, it can be static
   * since is not affecting the current list
   */
  static sendRemItem(value){
    ShopList.rem2[value] = {}; //what to remove from the fridge
    this.saved=false;
  }

  /*
   * This method is called from the fridge/sugg at every change, passing 
   * the new value.
   */
  receiveItem(value){ //from the fridge or sugg
    this.saved=false; //something has changed
    let tmp = this.state.data;
    tmp[value]={name:value};
    this.props.onChange("",value);
    this.setState({data:tmp});
  }


  /*
   * This method is used to set which EditableItem is actually focused
   * the active state is the key of the focused element, while rendering
   * all the others will be set to idle, if pressing on none of them 
   * (there's a TouchableWithoutFeedback) the key is set to null and
   * all of them are closed
   */
  closeAll(key){
    this.setState({active:key}); //all the other will be closed
  }

  /*
   * Taking data from the local storage and saving it to the active 
   * object, it's called in the constructor
   */
  async fetchData(){
    try{
      var tmp = await AsyncStorage.getItem(ITEM);
      tmp = tmp?JSON.parse(tmp):{}; 
      this.setState({data:tmp});
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
   * Send updated data back to local storage, called while unmounting,
   * if the fridge did't take the values (it hasn't been opened), they
   * are saved here, to avoid that data to be lost (both data2 and rem2).
   * The saving operation is blocked if there's nothing new (saved=false)
   */
  async storeData(){
    try{
      if(this.saved)
        return;
      this.saved=true; //now it's saved
      var tmp = this.state.data;
      const ITEM2 = "fridge";
      await AsyncStorage.setItem(ITEM,JSON.stringify(tmp));
      if(Object.keys(ShopList.data2).length || 
        Object.keys(ShopList.rem2).length){ //not been taken
        let tmp2 = await AsyncStorage.getItem(ITEM2);
        tmp2 = tmp2?JSON.parse(tmp2):{};
        Object.keys(ShopList.getData2()).forEach(e=>
          tmp2[e]={name:e}); //add them
        Object.keys(ShopList.getRem2()).forEach(e=>
          delete tmp2[e]); //remove them
        await AsyncStorage.setItem(ITEM2,JSON.stringify(tmp2));
      }
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
   * Called by pulling down, it's needed when the user made some 
   * modifications and want to see the results immediately without 
   * restarting the app. It loads the data from memory, merges with local
   * object and if there's something to save it does
   */
  async refreshData(){
    var tmp = await AsyncStorage.getItem(ITEM);
    tmp = tmp?JSON.parse(tmp):{}; //data from storage
    var locTmp = this.state.data;
    if(tmp!=this.state.data){ //something changed
      Object.assign(locTmp,tmp); //merge them
      Object.assign(this.rem,ShopList.data2); //merge removals
      Object.keys(this.rem)
        .forEach(e=>delete locTmp[e]); //apply removals
      this.rem={}; //removals have been saved
      this.setState({data:locTmp});
      this.saved=false;
    }
    this.storeData();
    this.props.refreshList(); //call the same on the main list
  }

  /*
   * Called by the fridge to retrieve what should be added to its own
   * list, after it the object is set to empty to avoid inserting the 
   * same data over again
   */
  static getData2(){
    let tmp = ShopList.data2;
    ShopList.data2 = {}; //empty after asked for
    return tmp;
  }

  /*
   * Same as above for removal
   */
  static getRem2(){
    let tmp = ShopList.rem2;
    ShopList.rem2 = {}; //empty after asked for
    return tmp;
  }

  /*
   * Renders all the elements in the list inside an EditableItem,
   * initializes all the properties sending needed method and setting
   * an unique key (React need it), the list is scrollable and outside
   * it's touchable, when the keyboard is up a View grows from 0 height
   * to almost the keyboard height, to shift the content to the visible
   * part of the screen, the button leads to the suggestions. The $new
   * item is added just here before rendering the whole stuff (without
   * using a setState because it will cause infinite rendering)
   */
  render(){
    const {navigate} = this.props.navigation;
    return( 
    <TouchableWithoutFeedback style={{flex:1}}
      onPress={this.closeAll.bind(this)}>
      <View style={styles().cont}>
        <ScrollView keyboardShouldPersistTaps="always"
          refreshControl = {<RefreshControl 
            refreshing={false} 
            progressBackgroundColor=
              {StyleSheet.flatten(styles().title).color}
            colors={[StyleSheet.flatten(styles().cont).backgroundColor]}
            onRefresh={this.refreshData.bind(this)}/>}>
          {Object.keys(this.state.data)
            .map((item) => (<EditableItem 
              key={item+(new Date()).getTime()}
              propKey={item}
              active={this.state.active==item?'y':'n'}
              text={this.state.data[item].name}
              closeOthers={this.closeAll.bind(this)}
              onChange={this.changeItem.bind(this)}
              onDone={this.sendItem.bind(this)}/>))}
          <EditableItem 
              key={"$new"+(new Date()).getTime()}
              propKey="$new"
              active={this.state.active=="$new"?'y':'n'}
              text=""
              closeOthers={this.closeAll.bind(this)}
              onChange={this.changeItem.bind(this)}
              onDone={this.sendItem.bind(this)}/>
        </ScrollView>
        <Animated.View style={{height:this.keyboardHeight,
          left:0,right:0,bottom:0}}/>
        <Touchable
          onPress={()=>navigate("Sugg")}>
          <View style={styles().button}>
            <Text style={styles().label}>NEED HELP?</Text>
          </View>
        </Touchable>
        <Button 
          title="Test (I'll not be there)"
          style={styles().button}
          color="indigo"
          onPress={()=>navigate("Test")}/>
      </View>
    </TouchableWithoutFeedback>
    );
  }

  /*
   * When the component is unmounted all the data in the list object is
   * saved back to the local storage, this method is not always called,
   * needs to be implemented an alternative call while the app is closing
   * or periodically to avoid big loss of data
   */
  componentWillUnmount(){
    this.storeData().done();
    this.keyboardDidShowLsnr.remove();
    this.keyboardDidHideLsnr.remove();
  }
}
