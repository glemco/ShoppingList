import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  AsyncStorage,
  AppState,
} from 'react-native';
import { WebBrowser } from 'expo';
import { MaterialIcons } from '@expo/vector-icons';
import Month from './Month.js';
import styling from './../../styles/StyleSheet.js';
import Touchable from './../../styles/Touchable';


import { range } from 'lodash';

const curr_month = new Date().getMonth()+1;
const curr_year = new Date().getFullYear();
const ITEM = "appointments";

export default class Calendar extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      Year: 2017,
      Months:{1:'January', 2:'February', 3:'March', 4:'April', 5:'May', 6:'June', 7:'July',
              8:'August', 9:'September', 10:'October', 11:'November', 12:'December'},
      Month:12,
      appointments:[],
    }
    this.fetchData().done();
  }

  componentWillMount(){
    AppState.addEventListener('change', state => {
      if(state!="active"){
        this.storeData().done(); //saves on close
      }
    });
  }

  async fetchData(){
    try{
      var tmp = await AsyncStorage.getItem(ITEM);
      tmp = tmp?JSON.parse(tmp):[];
      if(!tmp.length)
        tmp=["24/12/2017-18:00-Home-Christmas Dinner",
            "31/12/2017-22:00-Copenhagen Radhus Plads-New Year's Celebration",
            "16/12/2017-10:00-Appartment-Prepare for trip Home",
            "16/12/2017-12:00-Appartment-Do laundry",
            "16/12/2017-15:00-Horsens' Train station-Take train to Odense"];
      this.setState({appointments:tmp});
    } catch(e){
      Alert.alert(
        'Error',
        'An error occurred while loading the content',
        [
          {text: 'Cancel', onPress: () => console.log(e), style: 'cancel'},
          {text: 'Retry', onPress: () => console.log('Retry Pressed')},
        ],
        {cancelable:false}
      );
    }
  }

  /*
   * Put it back in memory (if there's something new)
   */
  async storeData(){
    try{
      if(this.saved)
        return;
      await AsyncStorage.setItem(ITEM,JSON
        .stringify(this.state.appointments));
      this.saved=true;
    } catch(e){
      Alert.alert(
        'Error',
        'An error occurred while saving the content',
        [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'Retry', onPress: () => console.log('Retry Pressed')},
        ],
        {cancelable:false}
      );
    }
  }

  saving_new_appointment(appointment){
    var appointments_old = this.state.appointments.slice();
    appointments_old.push(appointment);
    this.setState({appointments:appointments_old});
    this.saved=false;
  }

  renderWeekDays() {
      let weekdays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
      return weekdays.map((day) => {
          return (
              <Text key={day} 
                style={[styling().txt,styles.calendar_weekdays_text]}>
                {day.toUpperCase()}
              </Text>
          );
      });
  }

set_to_today = () => {
  this.setState({Year: curr_year, Month: curr_month});
}

  oneYearLess = () => this.setState({Year : this.state.Year-1});
  oneYearMore = () => this.setState({Year : this.state.Year+1});
  oneMonthLess = () => {
    if (this.state.Month == 1) {
      this.setState({Month : 12});
      this.setState({Year : this.state.Year-1});
    }
    else {
      this.setState({Month: this.state.Month-1});
    }
  }
  oneMonthMore = () => {

    if(this.state.Month == 12)
    {
      this.setState({Month : 1});
      this.setState({Year : this.state.Year+1});
    }
    else {
      this.setState({Month : this.state.Month+1});
    }
  }
/*<View style={{flex:1, flexDirection:'column' , paddingTop:20}}>}*/
  render() {
    return (
      <View style={{flex:1, flexDirection:'column' , paddingTop:20}}>
      {/*---------Start of the text header ------------------  */ }
      <View style={[styling().bar, {flexDirection: 'row'}]}>
        <View style={{flex:2}}>
          <Text style={[styling().title, styles.text_center]}>
            Calendar
          </Text>
        </View>
        <View>
          <Touchable
          onPress={this.set_to_today}
          style={{flex:1}}>
            <Text
            style={[styling().title, styles.text_right,
              {fontWeight:undefined}]}>Today</Text>
          </Touchable>
        </View>
      </View>
      {/*---------Start of the Calendar header ------------------  */ }
      <View style={[styling().bar, {flexDirection: 'row'}]}>
        <View style={styles.calendar_header}>
          <View style={styles.calendar_header_item}>
              <MaterialIcons
                onPress={this.oneYearLess}
                reverse
                raised
                size= {20}
                underlayColor='grey'
                name='chevron-left'
                style={styling().txt}
                />
              <Text style={[styling().title,styles.calendar_header_text]}>
                {this.state.Year}</Text>
              <MaterialIcons
                onPress={this.oneYearMore}
                reverse
                raised
                size={20}
                style={styling().txt}
                name='chevron-right' />
          </View>
          <View style={styles.calendar_header_item}>
          <MaterialIcons
            onPress={this.oneMonthLess}
            reverse
            raised
            size= {20}
            underlayColor='grey'
            style={styling().txt}
            name='chevron-left' />
          <Text style={[styling().title,styles.calendar_header_text]}>
            {this.state.Months[this.state.Month]}</Text>
          <MaterialIcons
            onPress={this.oneMonthMore}
            reverse
            raised
            size={20}
            style={styling().txt}
            name='chevron-right' />
          </View>
        </View>
      </View>
      {/*---------Start of the weekdays header ------------------  */ }
      <View style={styles.calendar_weekdays}>
         {this.renderWeekDays() }
      </View>
      {/*---------Start of the days in the actual calendar ------------------  */ }
      <View style={styles.calendar_days}>
        <Month
          save_appointment={this.saving_new_appointment.bind(this)}
          monthNumber={this.state.Month}
          currentYear={this.state.Year}
          appointments={this.state.appointments}/>
      </View>
      </View>
    );
  }

  componentWillUnmount(){
    this.storeData().done();
  }
}

const styles = StyleSheet.create({
  text_center: {
    textAlign: 'center',
    paddingLeft:20
  },
  text_right: {
      textAlign: 'right',
      paddingRight: 25
  },
  calendar_header: {
    flexDirection: 'row',
    flex:1,
    justifyContent:'space-around'
  },
  calendar_header_item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  calendar_header_text: {
      textAlign: 'center',
      fontSize: 16,
  },
  calendar_weekdays: {
      flex: 1,
      justifyContent: 'space-between',
      flexDirection: 'row',
  },
  calendar_days: {
      flexDirection:'column',
      flex:10,
      justifyContent:'flex-start',
  },
  calendar_weekdays_text: {
    flexDirection: 'row',
    flex: 1,
    textAlign : 'center',
    justifyContent: 'center',
    paddingBottom:3,
    paddingTop:5
  },
  week_days: {
      flexDirection: 'row',
      height:50,
      paddingBottom:2,
      paddingTop:2,

  },
});
