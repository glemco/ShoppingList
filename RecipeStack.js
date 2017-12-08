import React from 'react';
import { StyleSheet, Text, View, Alert,} from 'react-native';
import {StackNavigator,} from 'react-navigation';
import styles from './StyleSheet.js';
import RecipeSugg from './RecipeSugg';
import BlankRecipe from './BlankRecipe';

const Nav = StackNavigator({
  Main: {
    screen: RecipeSugg,
    navigationOptions:({navigation})=> ({ 
      headerTitle: "Suggested Recipes",
      headerStyle: styles.bar,
    }),
  },
  Recipe: {
    screen: BlankRecipe,
    navigationOptions:({navigation})=> ({ 
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
