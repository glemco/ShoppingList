import React from 'react';
import {DOMParser} from 'react-native-html-parser';

var Parser = new DOMParser({errorHandler:{warning:w=>null}});

export default class Utils{

  static fetchPage(url){
    return fetch(url)
      .then(resp=>resp.text())
      .then(text=>"<div"+text.split(/("site-content")|(pageFooter)/)[3]
        .replace(/<footer.*/,""))
      .then(text=>Parser.parseFromString(text,"text/html"))
      .catch(e=>console.log(e));
  }

}
