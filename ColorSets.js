import React from 'react';
import {StyleSheet,AsyncStorage,} from 'react-native';

/*
 * Class only containing static methods, it's used by the StyleSheet to
 * retrieve the colors of the currently applied theme and by the main
 * App to set it. The value is saved in the local storage, for that 
 * reason it's needed a small loading time to wait for it 
 */
  
export default class ColorSets{
  
  /*
   * Retrieve the index as a string and apply it
   */
  static async retrieveIndex(){
    var tmp = await AsyncStorage.getItem("theme");
    ColorSets.index = tmp?+tmp:0;
  }

  /*
   * Set the new index and save it to the local storage (will need to 
   * reload the application anyways since many components are mounted)
   */
  static setTheme(num){
    ColorSets.index = num;
    AsyncStorage.setItem("theme",""+ColorSets.index);
  }

  /*
   * Send the actual colors for the theme, use 0 as default when the 
   * index is not set (happens in the very beginning while loading
   */
  static getStylesheet(){
    var ind=ColorSets.index!=null?ColorSets.index:0;
    return ColorSets.themes[ind];
  }
}

/*
 * All the themes defined as main and secondary color, shaded one
 * (close to main, used to show the difference between background and 
 * items) and colors for the text (primary and secondary which are black
 * and white)
 */
ColorSets.themes = [
  {main:"black",second:"yellow",shade:"darkslategrey",
    text:"white",textSecond:"black"},
  {main:"darkred",second:"lawngreen",shade:"firebrick",
    text:"white",textSecond:"black"},
  {main:"indigo",second:"lightblue",shade:"navy",
    text:"white",textSecond:"black"},
  {main:"goldenrod",second:"lightseagreen",shade:"darkorange",
    text:"black",textSecond:"white"},
  {main:"palegreen",second:"orchid",shade:"lightskyblue",
    text:"black",textSecond:"white"},
  {main:"teal",second:"orangered",shade:"seagreen",
    text:"white",textSecond:"black"},
];

/*
 * Calls the retrieval
 */
ColorSets.retrieveIndex();
