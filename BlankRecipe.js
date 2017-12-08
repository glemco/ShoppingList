import React from 'react';
import { StyleSheet, Text, View, Alert, ActivityIndicator,
  ScrollView, Image, TouchableWithoutFeedback,} from 'react-native';
import styles from './StyleSheet.js';
import Utils from './Utils.js';

export default class BlankRecipe extends React.Component{
  constructor(props){
    super(props);
    this.data = this.props.navigation.state.params.data;
    console.log(this.data.url);
    this.state={ingredients:[],images:[],imgNum:0,directions:[]};
    this.fetchData().done;
  }

  static navigationOptions = ({navigation}) => ({
    headerTitle: navigation.state.params.data.title,
  });

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

  imgUp(){
    this.setState(prev=>{
      return {imgNum:(prev.imgNum+1)%prev.images.length}
    });
  }

  render(){
    return this.state.images.length?
      <ScrollView>
        <View style={styles.cont}>
          <TouchableWithoutFeedback
            onPress={this.imgUp.bind(this)}>
          <View style={styles.imgCont}>
            <Image source={{uri:this.state.images[this.state.imgNum]}} 
              style={styles.imgBig}/>
          </View>
          </TouchableWithoutFeedback>
          <Text style={styles.title}>Ingredients</Text>
          {this.state.ingredients.map((e,i)=>
          <Text key={"ing"+i}>{e}</Text>)}
          <Text style={styles.title}>Directions</Text>
          {this.state.directions.map((e,i)=>
          <Text key={"dir"+i}>{e}</Text>)}
        </View>
      </ScrollView>:
      <View style={{justifyContent:"center",flex:1}}>
        <ActivityIndicator size="large"/>
      </View>
  }
}
