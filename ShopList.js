import React from 'react';
import { StyleSheet, Text, View, Alert, TouchableWithoutFeedback,
        AsyncStorage, Button, Animated,Dimensions, 
        ScrollView, Keyboard} from 'react-native';
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
const BUTT_HEIGHT = 30;

export default class ShopList extends React.Component {

  /*
   * Here I'm initializing some static functions with methods,
   * it may not be the cleanest way but, since I know I have just 
   * one occurrence of the object (that should always be there while
   * needed), I can call them easily from everywhere else in the stack
   */
  constructor(props){
    super(props);
    console.log("ShopList starts");
    this.fetchData().done();
    this.state={data:{}};
    this.keyboardHeight = new Animated.Value(0);
    ShopList.data2 = {};
    ShopList.rem2 = {};
    ShopList.navigate = this.props.navigation.navigate.bind(this);
    ShopList.receiveItems = this.receiveItems.bind(this);
  }

  /*
   * These are used to get the keyboard event, on IOS the keyboardWill*
   * event should work better, but it's not there for Android
   */
  componentWillMount(){
    this.keyboardDidShowLsnr = Keyboard.addListener('keyboardDidShow',
      this.keyboardDidShow);
    this.keyboardDidHideLsnr = Keyboard.addListener('keyboardDidHide',
      this.keyboardDidHide);
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

  keyboardDidHide = (event)=>{
    Animated.timing(
      this.keyboardHeight,{
        toValue:0,
        duration:100,
      }
    ).start();
  };

  static navigationOptions = ({
    headerRight:<Button
          title="H"
          color='rgba(0,0,0,0)'
          style={{border:0}}
          onPress={()=>ShopList.navigate("Fridge",
            {updates:ShopList.getData2,sendBack:ShopList.receiveItems})}
        />,
  });

  /*
   * This is called when an EditableItem has been edited, with both 
   * arguments change from one to the other, otherwise it can just add
   * or just delete. It ensures that the $new field stays in the bottom
   * This method is also passing data to the main list (through methods
   * inside its props), so adding, deleting and changing the position
   * flag in there
   */
  changeItem(oldVal,newVal){
    let tmp = this.state.data;
    if(oldVal==newVal)
      return;
    delete tmp[oldVal];
    if(newVal && newVal.length){ //otherwise it's just a deletion
      tmp[newVal] = {name:newVal};
      this.props.onChange("",newVal);
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
    if(oldVal!="$new"){ //was a change
      delete tmp["$new"]; //put in the bottom
      this.props.onChange(oldVal); //can be overridden with ask
    }
    tmp["$new"]={name: ""}; //needs to add new line at bottom
    this.setState({data:tmp}); //this will reload
  }

  /*
   * When this is called an element is removed from the current list and
   * added to the temporary object storing what will be added to the 
   * fridge
   */
  sendItem(value){
    let tmp = this.state.data;
    delete tmp[value];
    ShopList.data2[value] = {name:value}; //what to add to the fridge
    this.props.changePos(value,"fridge"); //moving
    this.setState({data:tmp});
  }

  /*
   * The same as above but for removals from the fridge, it can be static
   * directly since is not affecting the current list
   */
  static sendRemItem(value){
    ShopList.rem2[value] = {}; //what to remove from the fridge
  }

  /*
   * This method is called from the fridge/sugg while unmounting and it's
   * passing the object containing all the elements that should be added 
   * here, again takes care of the $new element
   */
  receiveItems(obj){ //from the fridge
    let tmp = this.state.data;
    console.log("Updating shop");
    Object.keys(obj).forEach(e=>
      {tmp[e]={name:e}; //to update, changing position in called method
       this.props.onChange("",e)});
    delete tmp["$new"];
    tmp["$new"] = {name: ""}; //to add in the end
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
   * object, add the $new in the end, it's called in the constructor
   */
  async fetchData(){
    try{
      var tmp = await AsyncStorage.getItem(ITEM);
      tmp = tmp?JSON.parse(tmp):{}; 
      tmp["$new"] = {name: ""}; //will be added in tmp
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
   * are saved here, to avoid that data to be lost (both data2 and rem2)
   */
  async storeData(){
    try{
      var tmp = this.state.data;
      const ITEM2 = "fridge";
      delete tmp["$new"];
      await AsyncStorage.setItem(ITEM,JSON.stringify(tmp));
      if(Object.keys(ShopList.data2).length || 
        Object.keys(ShopList.rem2).length){ //not been taken
        tmp = await AsyncStorage.getItem(ITEM2);
        tmp = tmp?JSON.parse(tmp):{};
        Object.keys(ShopList.getData2()).forEach(e=>
          tmp[e]={name:e}); //add them
        Object.keys(ShopList.getRem2()).forEach(e=>
          delete tmp[e]); //remove them
        await AsyncStorage.setItem(ITEM2,JSON.stringify(tmp));
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
   * Called by the fridge to retrieve what should be added to its own
   * list, after it the object is set to empty to avoid inserting the 
   * same data over again
   */
  static getData2(){
    let tmp = ShopList.data2;
    //console.log("Passing "+Object.keys(tmp));
    ShopList.data2 = {}; //empty after asked for
    return tmp;
  }

  /*
   * Same as above for removal
   */
  static getRem2(){
    let tmp = ShopList.rem2;
    console.log("Passing "+Object.keys(tmp));
    ShopList.rem2 = {}; //empty after asked for
    return tmp;
  }

  /*
   * Renders all the elements in the list inside an EditableItem,
   * initializes all the properties sending needed method and setting
   * an unique key (React need it), the list is scrollable and outside
   * it's touchable, when the keyboard is up a View grows from 0 height
   * to almost the keyboard height, to shift the content to the visible
   * part of the screen, the button leads to the suggestions
   */
  render(){
    const {navigate} = this.props.navigation;
    return( 
    <TouchableWithoutFeedback style={styles.cont}
      onPress={this.closeAll.bind(this)}>
      <View style={{flex:1}}>
        <ScrollView keyboardShouldPersistTaps="always">
          {Object.keys(this.state.data)
            .map((item) => (<EditableItem 
              key={item+(new Date()).getTime()}
              propKey={item}
              active={this.state.active==item?'y':'n'}
              text={this.state.data[item].name}
              closeOthers={this.closeAll.bind(this)}
              onChange={this.changeItem.bind(this)}
              onDone={this.sendItem.bind(this)}/>))}
        </ScrollView>
        <Animated.View style={{height:this.keyboardHeight,
          left:0,right:0,bottom:0}}/>
        <Button 
          title="Need help?"
          style={styles.butt}
          color="teal"
          onPress={()=>navigate("Sugg")}/>
        <Button 
          title="Test"
          style={styles.butt}
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
    console.log("ShopList stops");
    this.keyboardDidShowLsnr.remove();
    this.keyboardDidHideLsnr.remove();
  }
}

const styles = StyleSheet.create({
  cont:{
    flex:1,
    backgroundColor:'khaki',
  },
  butt:{
    width:'75%',
    height:'20%',
  },
});
