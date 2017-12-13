import React from 'react';
import { Text, View, ActivityIndicator, AsyncStorage,
  TouchableWithoutFeedback, ScrollView, StyleSheet,
  AppState, Alert, Image, } from 'react-native';
import Touchable from './../../styles/Touchable';
import styles from './../../styles/StyleSheet.js';
import Utils from './Utils.js';
import ModalSelector from './ModalSelector';

/*
 * General page displaying a recipe, it receives the recipe data from the
 * calling frame and fetches all contents from it
 */

export default class BlankRecipe extends React.Component{
  constructor(props){
    super(props);
    this.data = this.props.navigation.state.params.data;
    this.state={ingredients:[],images:[],imgNum:0,directions:[],
      ingSplit:[],openModal:false,};
    this.shopData={};
    this.fetchData().done;
  }

  componentWillMount(){
    AppState.addEventListener('change', state => {
      if(state!="active")
        this.storeData().done(); //saves on close
    });
  }

  /*
   * The title will be the recipe title
   */
  static navigationOptions = ({navigation}) => ({
    headerTitle: navigation.state.params.data.title,
  });

  /*
   * Fetching from the provided link and filling arrays regarding
   * images (usually more than one), ingredients and steps to make
   * the dish
   */
  async fetchData(){
    var obj=await Utils.fetchPage(this.data.url);
    let ingredients=Array.from(obj
      .getElementsByClassName("recipe-ingred_txt added"))
      .map(e=>e.firstChild.data);
    let images=Array.from(obj
      .getElementsByClassName("photo-strip__items")[0]
      .getElementsByTagName("img"))
      .map(e=>e.getAttribute("src")
        .replace("125x70","400x210")
        .replace(/^\/\//,"http://"));
    let directions=Array.from(obj
      .getElementsByClassName("recipe-directions__list--item"))
      .filter(e=>e.firstChild).map(e=>e.firstChild.data);
    this.setState({ingredients:ingredients,images:images,
      directions:directions});
  }

  /*
   * Storing changes to shopping list from ingredients at once
   */
  async storeData(){
    const ITEM = 'toBuy';
    const ITEM2 = 'mainList';
    try{
      if(Object.keys(this.shopData).length){
        var tmp = await AsyncStorage.getItem(ITEM);
        tmp = tmp?JSON.parse(tmp):{};
        var tmp2 = await AsyncStorage.getItem(ITEM2);
        tmp2 = tmp2?JSON.parse(tmp2):{};
        Object.assign(tmp,this.shopData);
        Object.keys(this.shopData).forEach(e=>
          tmp2[e]={name:e,duration:tmp2[e]?tmp2[e].duration:0,
            lastDate:(new Date()).getTime(),position:"toBuy"});
        await AsyncStorage.setItem(ITEM,JSON.stringify(tmp));
        await AsyncStorage.setItem(ITEM2,JSON.stringify(tmp2));
        this.shopData={};
      }
    } catch(e){
      Alert.alert(
        'Error',
        'An error occurred while saving the content',
        [
          {text: 'Cancel', onPress: () => console.log(e), style: 'cancel'},
          {text: 'Retry', onPress: () => console.log('Retry Pressed')},
        ],
        {cancelable:false}
      );
    }
  }


  /*
   * Used to rotate among images, at each tap the index advances showing
   * the next image in the array (cyclic)
   */
  imgUp(){
    this.setState(prev=>{
      return {imgNum:(prev.imgNum+1)%prev.images.length}
    });
  }

  /*
   * Open modal selector and send data to it, since ingredients are not
   * single items but more complicated stuff, split the line into words,
   * try to exclude what is not an ingredient and ask the user what they 
   * actually want to add
   */
  openModal(label){
    var tmp=label.split(" ").filter(e=>!e.match(/[0-9()]/))
      .filter(e=>!e.match(/\bcup(s)?\b/))
      .filter(e=>!e.match(/spoon(s)?\b/))
      .filter(e=>!e.match(/\bcan(s)?\b/))
      .filter(e=>!e.match(/\bpound(s)?\b/))
      .filter(e=>!e.match(/\bounce(s)?\b/))
      .filter(e=>!e.match(/\bpackage(s)?\b/))
      .filter(e=>!e.match(/\bpiece(s)?\b/))
      .filter(e=>!e.match("size"))
      .filter(e=>!e.match(/\bslice[sd]?\b/)) //may go on
      .filter(e=>e.length>2)
      .map(e=>e.match(/[A-Za-z\-]+/)[0]);
    tmp.forEach((e,i,a)=>a[i+1] && !a[i+1].includes(" ")?
      a.push(e+" "+a[i+1]):null);
    this.setState({openModal:true,ingSplit:tmp});
  }

  /*
   * Called by the modal, just stores the selected value
   */
  toSend(value){
    if(this.props.navigation.state.params.fridge[value]){
      Alert.alert("","Item "+value+" is already in the fridge",
        [{text: "OK", onPress:()=>null}]);
      return;
    }
    this.shopData[value]={name:value};
    this.setState({openModal:false}); //close it from here too
  }

  /*
   * Rendering of all this stuff, everything needed is stored in the
   * state (to ensure reloading), while loading the page (before arrays
   * are filled), an ActivityIndicator is displayed
          items={this.getIngSplit}
   */
  render(){
    return this.state.images.length?
      <ScrollView>
        <ModalSelector isVisible={this.state.openModal}
          items={this.state.ingSplit}
          onSubmit={this.toSend.bind(this)}
          onClose={()=>this.setState({openModal:false})}/>
        <View style={styles().cont}>
          <TouchableWithoutFeedback
            onPress={this.imgUp.bind(this)}>
          <View style={styles().imgCont}>
            <Image source={{uri:this.state.images[this.state.imgNum]}} 
              style={styles().imgBig}/>
            <Text style={styles().caption}>
              Tap on the picture to see the next in the gallery
            </Text>
          </View>
          </TouchableWithoutFeedback>
          <Text style={styles().title}>Ingredients</Text>
          {this.state.ingredients.map((e,i)=>
          <Touchable key={"ing"+i} 
            onPress={()=>this.openModal(e)}>
            <View style={[styles().item,styles().itemSmall]}>
              <Text style={styles().li}>&#8900; {e}</Text>
            </View>
          </Touchable>)}
          <Text style={styles().caption}>
            Tap on an ingredient to add it to the shopping list
          </Text>
          <Text style={styles().title}>Directions</Text>
          {this.state.directions.map((e,i)=>
          <Text key={"dir"+i} style={styles().li}>{e}</Text>)}
        </View>
      </ScrollView>:
      <View style={[styles().cont,{justifyContent:"center"}]}>
        <ActivityIndicator size="large"
          color={StyleSheet.flatten(styles().title).color}/>
      </View>

  }

  componentWillUnmount(){
    this.storeData().done();
  }
}
