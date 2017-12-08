import React from 'react';
import { StyleSheet, Text, View, Alert, ScrollView, Image,
        AsyncStorage, TouchableNativeFeedback, 
        ActivityIndicator,} from 'react-native';
import Utils from './Utils.js';
import styles from './StyleSheet.js';

const BASE="http://allrecipes.com";
const RECIPES=BASE+"/search/results/?ingIncl=";
const MINLIM=5; //applied on overall recipes
const MAXLIM=7; //to filterafter retrievement

export default class RecipeSugg extends React.Component {
  constructor(props){
    super(props);
    this.fridge={};
    this.couples=[];
    this.triplets=[];
    this.isOver=[false,false,false]; //singlets,couples and triplets
    this.state={data:[],loaded:false};
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

  async tryMatching(str,ind,end){
    function getTitle(elm){
      return elm.getElementsByTagName("h3")[0]
        .firstChild.data.match(/([a-zA-Z'\-()]+ ?)+/)[0];
    }
    function getUrl(elm){
      return BASE+elm.getElementsByTagName("a")[0].
        getAttribute("href");
    }
    function getImage(elm){
      var img=elm.getElementsByClassName(
          "grid-col__rec-image")[0]
        .getAttribute("data-original-src").replace("250x250","100x100");
      return img;
    }
    let tmp=this.state.data;
    let obj=await Utils.fetchPage(RECIPES+str);
    let resNum=parseInt(obj.getElementsByClassName("subtext")[0]
      .firstChild.data);
    if(ind>=end)
      this.isOver[str.split(",").length-1]=true;
    if(this.isOver[0] && this.isOver[1] && this.isOver[2])
      this.setState({loaded:true});
    if(resNum<MINLIM){ //not worth match
      console.log("Dropped "+str);
      return null;
    }
    let results=Array.from(obj.getElementsByTagName("article"))
      .filter(e=>!e.hasAttribute("id") &&
        !e.getAttribute("class").match("video")
        && e.childNodes.length>4)
      .slice(0,MAXLIM);
    results.forEach(e=>{let name=getTitle(e)
      tmp[name]={title:name,ings:str,
      url:getUrl(e),img:getImage(e),}});
    //results.forEach(e=>tmp.push({title:getTitle(e),ings:str,
    //  url:getUrl(e),img:getImage(e),}));
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
      if(Object.keys(this.fridge).length<2) //no couples
        this.isOver[1]=true;
      if(Object.keys(this.fridge).length<3) //no triplets
        this.isOver[2]=true;
      console.log("Retrieving fridge for recipes");
      Object.keys(this.fridge).forEach((e,i,a)=>this.tryMatching(e,i,a.length-1));
      this.makeGroups();
      this.couples.forEach((e,i,a)=>this.tryMatching(e,i,a.length-1));
      this.triplets.forEach((e,i,a)=>this.tryMatching(e,i,a.length-1));
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
      //.filter(e=>!this.fridge[e].notFood); //may implement this
    this.couples=RecipeSugg.makeCouples(arr);
    this.triplets=RecipeSugg.makeTriplets(arr);
  }

  render(){
    return <ScrollView style={styles.cont}>
        {Object.keys(this.state.data).map((e,i)=>
          <TouchableNativeFeedback key={i}
            onPress={()=>this.props
              .navigation.navigate("Recipe",{data:this.state.data[e]})}>
            <View style={[styles.item,styles.itemBig]}>
              <Image source={{uri:this.state.data[e].img}} 
                style={styles.imgSmall} />
              <View style={{flex:1}}>
                <Text>{this.state.data[e].title}</Text>
                <Text style={{textAlign:"right",color:"lightslategrey"}}>
                  {this.state.data[e].ings}</Text>
              </View>
            </View>
          </TouchableNativeFeedback>)
          .concat(this.state.loaded?<Text key="load"/>:
            <ActivityIndicator key="load"/>)}
      </ScrollView>;
  }

}
