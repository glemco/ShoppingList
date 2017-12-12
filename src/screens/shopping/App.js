import React from 'react';
import { Text, View, Alert,
        AsyncStorage, Button} from 'react-native';
import {TabNavigator} from 'react-navigation';
import styles from './StyleSheet.js';
import List from './List';
import ShopList from './ShopList';
import FridgeList from './FridgeList';
import RecipeStack from './RecipeStack';
import ModalSelector from './ModalSelector';
import ColorSets from './ColorSets';

class Main extends React.Component{
  constructor(props){
    super(props);
  }

  clearStorage(){
    console.log("Removing everithing in here");
    AsyncStorage.removeItem("mainList");
    AsyncStorage.removeItem("toBuy");
    AsyncStorage.removeItem("fridge");
  }

  render(){
    const {navigate} = this.props.navigation;
    return <View style={[styles().cont,{padding:0}]}>
              <View style={styles().button}/>
              <Button title="Shopping List" 
                onPress={()=>navigate("List")}/>
              <Button title="Suggested Recipes"
                color="chocolate"
                onPress={()=>navigate("Recipes")}/>
              <Button title="Theme 1"
                color="black"
                onPress={()=>App.changeTheme(0)}/>
              <Button title="Theme 2"
                color="darkred"
                onPress={()=>App.changeTheme(1)}/>
              <Button title="Theme 3"
                color="indigo"
                onPress={()=>App.changeTheme(2)}/>
              <Button title="Theme 4"
                color="goldenrod"
                onPress={()=>App.changeTheme(3)}/>
              <Button title="Theme 5"
                color="palegreen"
                onPress={()=>App.changeTheme(4)}/>
              <Button title="Theme 6"
                color="teal"
                onPress={()=>App.changeTheme(5)}/>
              <Button title="Clear All Data" 
                color="red"
                onPress={()=>
                Alert.alert(
                  'Attention!',
                  'Are you sure to delete everything in here?',
                  [
                    {text: 'Yes', onPress:()=>this.clearStorage()},
                    {text: 'No', onPress:()=>console.log('No Pressed')},
                  ],
                )}/>
           </View>
  }

}

/*
 * In this way the navigator is created every time (with updated data)
 */
const NavF = ()=>TabNavigator({
  Main: {
    screen: Main,
    navigationOptions:({navigation})=>({
    }),
  },
  List: {
    screen: List,
  },
  Recipes: {
    screen: RecipeStack,
  },
},({
  tabBarPosition: 'bottom',
  tabBarOptions:({ 
    style: [styles().bar,{paddingTop:2,height:60}],
    labelStyle: [styles().icon,{fontSize:undefined}],
    indicatorStyle:styles().line,
  }),
}));

export default class App extends React.Component {

  constructor(props){
    super(props);
    this.state={loaded:false};
    App.changeTheme = this.changeTheme.bind(this);
  }

  /*
   * This is to ensure the color has been loaded (cannot wait for it from
   * here so I put a conservative delay)
   */
  componentDidMount(){
    setTimeout(()=>this.setState({loaded:true}),100);
  }

  /*
   * This will reload the whole app to change the theme
   */
  changeTheme(num){
    ColorSets.setTheme(num);
    this.setState({theme:num});
    //Alert.alert( //it should be ok now
    //  "","Changes will be complete after having restarted the app",
    //  [
    //    {text: 'Ok', onPress:()=>null},
    //  ],
    //)
  }

  /*
   * The TabNavigator is no more a constant but a function, so that at
   * each render it's recomputer with the new colors
   */
  render(){
    let Nav = NavF(); //redo at each render
    return this.state.loaded?<Nav/>:<View/>
  }
}
