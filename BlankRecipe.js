import React from 'react';
import { StyleSheet, Text, View, Alert, ActivityIndicator,
  ScrollView, Image, TouchableWithoutFeedback,} from 'react-native';
import styles from './StyleSheet.js';
import Utils from './Utils.js';

/*
 * General page displaying a recipe, it receives the recipe data from the
 * calling frame and fetches all contents from it
 */

export default class BlankRecipe extends React.Component{
  constructor(props){
    super(props);
    this.data = this.props.navigation.state.params.data;
    console.log(this.data.url);
    this.state={ingredients:[],images:[],imgNum:0,directions:[]};
    this.fetchData().done;
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
   * Used to rotate among images, at each tap the index advances showing
   * the next image in the array (cyclic)
   */
  imgUp(){
    this.setState(prev=>{
      return {imgNum:(prev.imgNum+1)%prev.images.length}
    });
  }

  /*
   * Rendering of all this stuff, everything needed is stored in the
   * state (to ensure reloading), while loading the page (before arrays
   * are filled), an ActivityIndicator is displayed
   */
  render(){
    return this.state.images.length?
      <ScrollView>
        <View style={styles.cont}>
          <TouchableWithoutFeedback
            onPress={this.imgUp.bind(this)}>
          <View style={styles.imgCont}>
            <Image source={{uri:this.state.images[this.state.imgNum]}} 
              style={styles.imgBig}/>
            <Text style={styles.caption}>
              Tap on the picture to see the next in the gallery
            </Text>
          </View>
          </TouchableWithoutFeedback>
          <Text style={styles.title}>Ingredients</Text>
          {this.state.ingredients.map((e,i)=>
          <Text key={"ing"+i} style={styles.li}>&#8900; {e}</Text>)}
          <Text style={styles.title}>Directions</Text>
          {this.state.directions.map((e,i)=>
          <Text key={"dir"+i} style={styles.li}>{e}</Text>)}
        </View>
      </ScrollView>:
      <View style={{justifyContent:"center",flex:1}}>
        <ActivityIndicator size="large"/>
      </View>
  }
}
