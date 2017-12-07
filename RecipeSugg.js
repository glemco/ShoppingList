import React from 'react';
import { StyleSheet, Text, View, Alert, ScrollView, Image,
        AsyncStorage, TouchableNativeFeedback, 
        ActivityIndicator,} from 'react-native';
import Utils from './Utils.js';

const BASE="http://allrecipes.com";
const RECIPES=BASE+"/search/results/?ingIncl=";
const MINLIM=7; //applied on overall recipes
const MAXLIM=5; //to filterafter retrievement

export default class RecipeSugg extends React.Component {
  constructor(props){
    super(props);
    this.fridge={};
    this.couples=[];
    this.triplets=[];
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
        .firstChild.data.match(/([a-zA-Z']+ ?)+/)[0];
    }
    function getUrl(elm){
      return BASE+elm.getElementsByTagName("a")[0].
        getAttribute("href");
    }
    function getImage(elm){
      var img=elm.getElementsByClassName(
          "grid-col__rec-image")[0]
        .getAttribute("data-original-src").replace("250x250","50x50");
      return img;
    }
    let tmp=this.state.data;
    //let str=arr.reduce((a,b)=>a+","+b,"").substr(1); //no more needed
    let obj=await Utils.fetchPage(RECIPES+str);
    let resNum=parseInt(obj.getElementsByClassName("subtext")[0]
      .firstChild.data);
    if(ind!=undefined && ind==end){
      this.setState({loaded:true});
      console.log("done");
    }
    if(resNum<MINLIM){ //not worth match
      console.log("Dropped "+str);
      return null;
    }
    let results=Array.from(obj.getElementsByTagName("article"))
      .filter(e=>!e.hasAttribute("id") &&
        !e.getAttribute("class").match("video")
        && e.childNodes.length>4)
      .slice(0,MAXLIM);
    results.forEach(e=>tmp.push({title:getTitle(e),ings:str,
      url:getUrl(e),img:getImage(e),}));
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
      this.triplets.forEach((e,i,a)=>this.tryMatching(e,i,a.length-1));
      //this.setState({loaded:true}); //not working because of async
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
    if(arr.length>2)
      this.triplets=RecipeSugg.makeTriplets(arr);
  }

  render(){
    return <ScrollView>
        {this.state.data.map((e,i)=>
          <TouchableNativeFeedback key={i}
            onPress={()=>this.props
              .navigation.navigate("Recipe",{data:e})}>
            <View style={styles.item}>
              <Image source={{uri:e.img}} style={styles.img} />
              <View style={{flex:1}}>
                <Text>{e.title}</Text>
                <Text style={{textAlign:"right",color:"lightslategrey"}}>
                  {e.ings}</Text>
              </View>
            </View>
          </TouchableNativeFeedback>)
          .concat(this.state.loaded?<Text key="load"/>:
            <ActivityIndicator key="load"/>)}
      </ScrollView>;
  }

}

const styles = StyleSheet.create({
  item:{
    height:50,
    backgroundColor:"aliceblue",
    flexDirection:"row",
    margin:2,
    marginBottom:5,
    paddingLeft:10,
    paddingRight:10,
  },
  img:{
    width:46,
    height:46,
    marginRight:9,
  },
});
