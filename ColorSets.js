import React from 'react';
import {StyleSheet,AsyncStorage,} from 'react-native';

  
export default class ColorSets{
  
  static async retrieveIndex(){
    var tmp = await AsyncStorage.getItem("theme");
    ColorSets.index = tmp?+tmp:0;
  }

  static setTheme(num){
    ColorSets.index = num;
    AsyncStorage.setItem("theme",""+ColorSets.index);
  }

  static getStylesheet(){
    var ind=ColorSets.index?ColorSets.index:4;
    return ColorSets.themes[ind];
  }
}

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

ColorSets.retrieveIndex();
