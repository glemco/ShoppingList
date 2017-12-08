import React from 'react';
import {DOMParser} from 'react-native-html-parser';

var Parser = new DOMParser({errorHandler:{warning:w=>null}});

export default class Utils{

  /*
   * Static method called by whoever may need it to retrieve a web page
   * and parse it as a DOM-like object (using external library for that)
   * To avoid fetching useless stuff it's cutting the page and parsing
   * just the 'site-content' div (specific solution for the website I'm 
   * using, will probably not work in other cases)
   */
  static fetchPage(url){
    return fetch(url)
      .then(resp=>resp.text())
      .then(text=>"<div"+text.split(/("site-content")|(pageFooter)/)[3]
        .replace(/<footer.*/,""))
      .then(text=>Parser.parseFromString(text,"text/html"))
      .catch(e=>console.log(e));
  }

}
