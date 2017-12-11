import React from 'react';
import { StyleSheet, } from 'react-native';
import {StackNavigator,} from 'react-navigation';
import styles from './StyleSheet.js';
import RecipeSugg from './RecipeSugg';
import BlankRecipe from './BlankRecipe';

/*
 * Simple stack navigator that displays the recipes list by default and,
 * while tapping on them, opens a new page with the related information
 */
const Nav = StackNavigator({
  Main: {
    screen: RecipeSugg,
    navigationOptions:({navigation})=> ({ 
      headerTitle: "Suggested Recipes",
      headerStyle: styles().bar,
      headerTitleStyle: styles().barText,
      headerTintColor: StyleSheet.flatten(styles().title).color,
      headerRight: RecipeSugg.navigationOptions().headerRight,
    }),
  },
  Recipe: {
    screen: BlankRecipe,
    navigationOptions:({navigation})=> ({ 
      headerStyle: styles().bar,
      headerTitleStyle: styles().barText,
      headerTintColor: StyleSheet.flatten(styles().title).color,
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
}
