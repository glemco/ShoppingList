import React from 'react';
import { StyleSheet, Text, View, Alert,
        AsyncStorage, Button} from 'react-native';
import {StackNavigator,} from 'react-navigation';
import List from './List';
import ShopList from './ShopList';
import FridgeList from './FridgeList';

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
    return <View style={{flex:1}}>
              <Button title="Shopping List" 
                onPress={()=>navigate("List")}/>
              <Button title="Clear All" 
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

const styles = StyleSheet.create({
  bar:{
    backgroundColor:'olive',
    paddingTop:'10%',
  },
  container: {
    flex: 1,
    justifyContent:'center',
  },
});

const Nav = StackNavigator({
  Main: {
    screen: Main,
    navigationOptions:({navigation})=> ({ 
      headerTitle: "Alfred foo",
      headerStyle: styles.bar,
    }),
  },
  List: {
    screen: List,
    navigationOptions:({navigation})=> ({ 
      headerTitle: "Shopping List",
      headerStyle: styles.bar,
    }),
  },
});

export default class App extends React.Component {

  constructor(props){
    super(props);
  }

  render(){
    return <Nav />;
  }

  componentWillUnmount(){
    console.log("I'm done");
  }
}
