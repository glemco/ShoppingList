import React from 'react';
import { StyleSheet, Text, View, Alert, ScrollView,
        AsyncStorage, Button,} from 'react-native';
import { DOMParser } from 'xmldom';

const RECIPES="http://allrecipes.com/search/results/?ingIncl=";
const LIMIT=7;

export default class RecipeSugg extends React.Component {
  constructor(props){
    super(props);
    this.fridge={};
    this.couples=[];
    this.triplets=[];
    this.fetchData().done();
    this.makeGroups();
  }

  static cartesianProduct(arr){
    return arr.reduce((a,b)=>
        a.map((x)=>b.map((y)=>x.concat(y))
      ).reduce((a,b)=>a.concat(b),[]),[[]])
  }

  static fetchPage(url){
    return fetch(url)
      .then(resp=>resp.text())
      .then(text=>new DOMParser().parseFromString(text))
      .catch(e=>console.log(e));
  }

  async tryMatching(arr){
    let str=arr.reduce((a,b)=>a+","+b,"").substr(1);
    let obj=await fetchPage(RECIPES+str);
    let resNum=parseInt(Array.from(obj.getElementsByTagName("div"))
      .filter(e=>e.className=="results-container")[0].textContent);
    if(resNum<LIMIT) //not worth match
      return null;
    let results=Array.from(obj.getElementsByTagName("article"))
      .filter(e=>!e.id);
  }

  /*
   * Fetching data from local storage
   */
  async fetchData(){
    try{
      var tmp = await AsyncStorage.getItem("fridge");
      this.fridge=tmp?JSON.parse(tmp):{};
      console.log("Retrieving fridge");
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
    let arr=Object.keys(this.fridge);
    this.couples=RecipeSugg.cartesianProduct([arr,arr]);
    if(arr.length>2)
      this.triplets=RecipeSugg.cartesianProduct([arr,arr,arr]);
  }

  render(){
    return <View></View>;
  }

}
