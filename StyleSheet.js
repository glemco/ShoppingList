import React from 'react';
import {StyleSheet} from 'react-native';
import ColorSets from './ColorSets';

/*
 * Styles for the whole part (may be merged with complete app stylesheet)
 * instead of a variable they are returned as a function to have updated
 * colors (used in themes)
 * This is a StyleSheet, that means that the object returned is not
 * directly accessible, if u need to retrieve some properties (such as
 * the main color of the current theme) use StyleSheet.flatten(obj.field)
 */

export default ()=>{let colors = ColorSets.getStylesheet();
  return StyleSheet.create({
  bar:{
    backgroundColor:colors.main,
    paddingTop:36,
    paddingBottom:14,
    height:80,
  },
  barText:{
    color:colors.text,
  },
  cont:{
    flex:1,
    padding:10,
    backgroundColor:colors.shade,
  },
  title:{
    fontSize:20,
    fontWeight:"bold",
    color:colors.second,
  },
  caption:{
    textAlign:"right",
    color:"lightslategrey",
    fontStyle:"italic",
  },
  txt:{
    color:colors.text,
  },
  label:{
    color:colors.textSecond,
    fontWeight:"bold",
    fontSize:15,
  },
  li:{
    marginLeft:10,
    color:colors.text,
  },
  button:{
    height:40,
    padding:6,
    backgroundColor:colors.second,
    alignItems:"center",
    justifyContent:"center",
  },
  line:{
    backgroundColor:colors.second,
  },
  item:{
    height:50,
    padding:6,
    flexDirection:'row',
    alignItems:"center",
    margin:2,
    marginBottom:5,
    backgroundColor:colors.main,
  },
  itemSmall:{
    height:30,
    backgroundColor:undefined,
  },
  itemBig:{
    height:80,
    paddingLeft:10,
    paddingRight:10,
    alignItems:"stretch",
  },
  icon:{
    fontSize:20,
    padding:2,
    paddingRight:6,
    color:colors.second,
  },
  imgCont:{
    justifyContent:'center',
    alignItems:'center',
  },
  imgSmall:{
    width:70,
    height:70,
    marginRight:16,
  },
  imgBig:{
    width:350,
    height:180,
  },
  modButt:{
    padding:10,
    color:colors.second,
    fontWeight:"bold",
    paddingBottom:7,
  },
  modCont:{
    margin:30,
    backgroundColor:colors.textSecond,
    padding:7,
  },
  modHead:{
    borderBottomWidth:1,
    padding:7,
    borderBottomColor:"lightgray",
    marginBottom:5,
  },
  modFoot:{
    flexDirection:"row",
    justifyContent:"flex-end",
    borderTopWidth:1,
    borderTopColor:"lightgray"
  },
  modBack:{
    backgroundColor:"rgba(0,0,0,.7)",
    flex:1,
    justifyContent:"center",
  },
})
};
