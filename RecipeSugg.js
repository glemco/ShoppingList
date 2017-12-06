import React from 'react';
import { StyleSheet, Text, View, Alert, ScrollView,
        AsyncStorage, TouchableNativeFeedback, ActivityIndicator,} from 'react-native';
//import Parser from 'react-native-parse-html';
import {DOMParser} from 'react-native-html-parser';

const RECIPES="http://allrecipes.com/search/results/?ingIncl=";
const MINLIM=7; //applied on overall recipes
const MAXLIM=5; //to filterafter retrievement

var Parser = new DOMParser({errorHandler:{warning:w=>{return null}}});

export default class RecipeSugg extends React.Component {
  constructor(props){
    super(props);
    this.fridge={};
    this.couples=[];
    this.triplets=[];
    this.state={data:[]};
    this.fetchData();
  }

  static makeCouples(arr){
    return arr.reduce((ful,e,i) =>
    ful.concat(arr.slice(i+1)
	.map(e2=>e+','+e2)),[]);
  }

  static makeTriplets(arr){
    return arr.reduce((ful,e,i)=>
      ful.concat(arr.slice(i+1)
        .map((e2,i2)=>arr.slice(i+i2+2)
          .map(e3=>e+","+e2+","+e3))),[])
    .reduce((a,b)=>a.concat(b),[])
  }

  static fetchPage(url){
    return fetch(url)
      .then(resp=>resp.text())
      .then(text=>"<div"+text.split(/("site-content")|(pageFooter)/)[3]
        .replace(/<footer.*/,""))
      .then(text=>Parser.parseFromString(text,"text/html"))
      .catch(e=>console.log(e));
  }

  async tryMatching(str,num){
    function getTitle(elm){
      return elm.getElementsByTagName("h3")[0]
        .firstChild.data.match(/([a-zA-Z']+ ?)+/)[0];
    }
    function getUrl(elm){
      return "http://allrecipes.com/"+elm.getElementsByTagName("a")[2].
        getAttribute("href");
    }
    let tmp=this.state.data;
    //let str=arr.reduce((a,b)=>a+","+b,"").substr(1); //no more needed
    let obj=await RecipeSugg.fetchPage(RECIPES+str);
    let resNum=parseInt(obj.querySelect(".subtext")[0].firstChild.data);
    if(resNum<MINLIM){ //not worth match
      console.log("Dropped "+str);
      if(num) //single food match
        this.fridge[str].notFood=true;
      return null;
    }
    let results=Array.from(obj.getElementsByTagName("article"))
      .filter(e=>!e.hasAttribute("id") &&
        !e.getAttribute("class").match("video")
        && e.childNodes.length>4)
      .slice(0,MAXLIM);
    results.forEach(e=>tmp.push({title:getTitle(e),ings:str,
      url:getUrl(e)}));
    this.setState({data:tmp});
    return resNum;
  }

  /*
   * Fetching data from local storage
   */
  async fetchData(){
    try{
      var tmp = await AsyncStorage.getItem("fridge");
      this.fridge=tmp?JSON.parse(tmp):{};
      console.log("Retrieving fridge for recipes");
      Object.keys(this.fridge).forEach(e=>this.tryMatching(e));
      this.makeGroups();
      this.couples.forEach(e=>this.tryMatching(e));
      this.triplets.forEach(e=>this.tryMatching(e));
    } catch(e){
      Alert.alert(
        'Error',
        'An error occurred while loading the content',
        [
          {text: 'Cancel', onPress:()=>console.log(e), style: 'cancel'},
          {text: 'Retry', onPress:()=>console.log('Retry Pressed')},
        ],
        {cancelable:false}
      );
    }
  }

  makeGroups(){
    let arr=Object.keys(this.fridge)
      .filter(e=>!this.fridge[e].notFood);
    this.couples=RecipeSugg.makeCouples(arr);
    if(arr.length>2)
      this.triplets=RecipeSugg.makeTriplets(arr);
    this.setState({load:false});
  }

  render(){
    return <ScrollView>
        {this.state.data.map((e,i)=>
          <TouchableNativeFeedback key={i}
            onPress={()=>console.log(e.url)}>
            <Text href={e.url}>{e.title}</Text>
          </TouchableNativeFeedback>)
          .concat(<ActivityIndicator key="load"/>)}
      </ScrollView>;
  }

}
