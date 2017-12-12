import React from 'react';
import { Text, View, Alert, ScrollView, Image, RefreshControl,
        AsyncStorage, TouchableNativeFeedback, 
        ActivityIndicator,} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Utils from './Utils.js';
import styles from './StyleSheet.js';

const BASE="http://allrecipes.com";
const RECIPES=BASE+"/search/results/?ingIncl="; //to query the website
const MINLIM=5; //applied on overall recipes
const MAXLIM=7; //to filterafter retrievement

export default class RecipeSugg extends React.Component {

  /*
   * Initialization with all props and empty objects, the isOver array
   * states (among groups of 1,2 and 3) which ended their loading, in the
   * state, data is an object containing all the retrieved recipes (not
   * an array because using the name as key prevents duplicates), which
   * are objects themselves having title, url, image and selected 
   * ingredients as properties (fetched from the page DOM)
   */
  constructor(props){
    super(props);
    this.fridge={};
    this.couples=[];
    this.triplets=[];
    this.isOver=[false,false,false]; //singlets,couples and triplets
    this.state={data:[],loaded:false};
    this.fetchData();
    RecipeSugg.reload=this.doReload.bind(this);
  }

  /*
   * Define the header button to reload
   */
  static navigationOptions(){
    return {
      headerRight:(<TouchableNativeFeedback
            style={{fontSize:100}}
            onPress={()=>RecipeSugg.reload()}>
            <Icon name="refresh" style={[styles().icon,{fontSize:30}]}/>
          </TouchableNativeFeedback>),
    };
  }


  /*
   * Function to enumerate all couples out of an array, the result is 
   * an array with all of them as comma separated groups
   */
  static makeCouples(arr){
    return arr.reduce((ful,e,i) =>
    ful.concat(arr.slice(i+1)
	.map(e2=>e+','+e2)),[]);
  }

  /*
   * As above for triplets, if arr doesn't contain enough elements (here
   * less than 3), [] is returned
   */
  static makeTriplets(arr){
    return arr.reduce((ful,e,i)=>
      ful.concat(arr.slice(i+1)
        .map((e2,i2)=>arr.slice(i+i2+2)
          .map(e3=>e+","+e2+","+e3))),[])
    .reduce((a,b)=>a.concat(b),[])
  }

  /*
   * Function to retrieve the recipes with the ingredients stored in str
   * (comma separated), receiving also the index and the last element of
   * the current group (used to know if the group, say couples, is ending
   * its loading). All functions are retrieving the desired data (title,
   * url..) out of the recipe element retrieved from the DOM. If the 
   * results are less than a specified MINLIM, the group is discarded,
   * after retrieval the first MAXLIM recipes are taken (to avoid having
   * too many results, may implement a 'more' button to load them too).
   * Finally the state.data object is populated with the newly retrieved
   * data (with the structure specified above), all DOM queries are 
   * specific for that website only, the image retrieved is resized (it
   * seems that size contains a large amount o resolutions for each image
   * so the best one is taken)
   */
  async tryMatching(str,ind,end){
    function getTitle(elm){
      return elm.getElementsByTagName("h3")[0]
        .firstChild.data.match(/([a-zA-Z0-9'\-(),]+ ?)+/)[0];
    }
    function getUrl(elm){
      return BASE+elm.getElementsByTagName("a")[0].
        getAttribute("href");
    }
    function getImage(elm){ //take the resized version
      var img=elm.getElementsByClassName(
          "grid-col__rec-image")[0]
        .getAttribute("data-original-src").replace("250x250","100x100");
      return img;
    }
    this.setState({loadLog:"Fetching recipes for "+str});
    let tmp=this.state.data;
    let obj=await Utils.fetchPage(RECIPES+str);
    let resNum=parseInt(obj.getElementsByClassName("subtext")[0]
      .firstChild.data);
    if(ind>=end)
      this.isOver[str.split(",").length-1]=true;
    if(this.isOver[0] && this.isOver[1] && this.isOver[2])
      this.setState({loaded:true});
    if(resNum<MINLIM) //not worth match
      return null;
    let results=Array.from(obj.getElementsByTagName("article"))
      .filter(e=>!e.hasAttribute("id") &&
        !e.getAttribute("class").match("video")
        && e.childNodes.length>4)
      .slice(0,MAXLIM);
    results.forEach(e=>{let name=getTitle(e)
      tmp[name]={title:name,ings:str,
      url:getUrl(e),img:getImage(e),}});
    this.setState({data:tmp});
    return resNum;
  }

  /*
   * Fetching data from local storage, initialize isOver array if some 
   * groups cannot be made (not enough elements) and try all the matches
   * with all the groups, with this structure if duplicates are found, 
   * they are associated with the biggest group (should be it's computed 
   * after)
   */
  async fetchData(){
    try{
      var tmp = await AsyncStorage.getItem("fridge");
      this.fridge=tmp?JSON.parse(tmp):{};
      if(Object.keys(this.fridge).length<1) //nothing at all
        this.setState({loaded:true}); //will not be computed
      if(Object.keys(this.fridge).length<2) //no couples
        this.isOver[1]=true;
      if(Object.keys(this.fridge).length<3) //no triplets
        this.isOver[2]=true;
      Object.keys(this.fridge).forEach((e,i,a)=>
        this.tryMatching(e,i,a.length-1));
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

  /*
   * Simple function to call the group makers for the elements in the 
   * fridge, here it can be further optimized by directly discarding
   * the elements that are not food (or in general that don't have 
   * matches even being taken alone)
   */
  makeGroups(){
    let arr=Object.keys(this.fridge);
      //.filter(e=>!this.fridge[e].notFood); //may implement this
    this.couples=RecipeSugg.makeCouples(arr);
    this.triplets=RecipeSugg.makeTriplets(arr);
  }

  doReload(){
    this.setState({loaded:false,data:[]});
    this.isOver=[false,false,false];
    this.fetchData();
  }

  /*
   * Render all the elements as TouchableNativeFeedback components 
   * containing the image, the title and the ingredients that made the 
   * query. By pressing them the BlankRecipe page is called passing 
   * the recipe object to shape it. While elements are still loading,
   * in the bottom an ActivityIndicator is shown together with a label
   * showing the last group that started the fetch, it will disappear
   * while all the groups will have loaded
   */
  render(){
    return <View style={styles().cont}>
        <ScrollView
          refreshControl = {<RefreshControl 
            refreshing={!this.state.loaded} 
            onRefresh={this.doReload.bind(this)}/>}>
           
        {Object.keys(this.state.data).map((e,i)=>
          <TouchableNativeFeedback key={i}
            onPress={()=>this.props
              .navigation.navigate("Recipe",{data:this.state.data[e],
                fridge:this.fridge})}>
            <View style={[styles().item,styles().itemBig]}>
              <Image source={{uri:this.state.data[e].img}} 
                style={styles().imgSmall} />
              <View style={{flex:1,justifyContent:"space-around",}}>
                <Text style={styles().txt}>
                  {this.state.data[e].title}
                </Text>
                <Text style={styles().caption}>
                  {this.state.data[e].ings}</Text>
              </View>
            </View>
          </TouchableNativeFeedback>)
          .concat(this.state.loaded?<View key="load"/>:
            <View key="load" style={styles().item}>
              <ActivityIndicator style={{paddingRight:10}}/>
              <Text style={styles().caption}>{this.state.loadLog}</Text>
            </View>)}
        </ScrollView>
      </View>;
  }

}
