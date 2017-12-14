import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  TouchableHighlight
} from 'react-native';
import { WebBrowser } from 'expo';
import { Entypo } from '@expo/vector-icons';
import Calendar_pop_up from './Calendar_pop_up.js';
import styles from './../../styles/StyleSheet.js';

import { range } from 'lodash';


const weekdays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const MonthName ={1:'January', 2:'February', 3:'March', 4:'April', 5:'May', 6:'June', 7:'July',
        8:'August', 9:'September', 10:'October', 11:'November', 12:'December'};

const date = new Date().getDate();
const curr_month = new Date().getMonth()+1;
const curr_year = new Date().getFullYear();


export default class Month extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal:false,
      isModalVisible: false,
      currentDay: 0,
      weekIndex: 0,
      days_with_appointment:[],
    }
    const month = this.props.monthNumber;
    const year = this.props.currentYear;
  }



_showModal(day, index) {
  this.setState({ isModalVisible: true , currentDay: day, weekIndex: index})
}

_hideModal = () => this.setState({ isModalVisible: false })

get_days_with_appointments (appointments_array){
  for (var i = 0; i < appointments_array.length; i++) {
    var appo_split = appointments_array[i].split("-");
    var appo_date = appo_split[0].split("/");
    var old_array_of_appointments = [];
    if ((appo_date[1]==this.month)&&(appo_date[2]==this.year)) {
      for (var j = 0; j < this.state.days_with_appointment.length; j++) {
        old_array_of_appointments.push(this.state.days_with_appointment[j]);
      }
      old_array_of_appointments.push(appo_date[0])
    }
    this.setState({days_with_appointment: old_array_of_appointments});
  }
}



renderWeeks() {
  //this.get_days_with_appointments(this.props.appointments);
  var month = this.props.monthNumber;
  var zero = 0;
  var this_month_days = [];
  if ((month <=7 ) && (month%2==1)) {
    this_month_days = range(1, 32);
  }
  else if (month===2) {
    this_month_days = range(1,29);
  }
  else if ((month>=8)&&((month%2)===0)) {
    this_month_days = range(1, 32);
  }
  else {
    this_month_days = range(1, 31);
  }
  var m = 0;// months in Zeller's rule for calendar go from Apri (1st month) to February (12th month)
  var d = this.props.currentYear;
  d = d - 2000;
  if (month<=2) {
    m = month + 10;
    d -= 1;
  }
  else {
    m= month - 2;
  }
  var offset_days = 1 + ((13*m-1)/5) + d + (d/4) + 5 - 2*20;
  if (offset_days>=0) {
    offset_days = offset_days%7;// this offset is according to Zeller's rule
    offset_days = Math.trunc(offset_days);

  }
  else if (offset_days<0) {
    while (offset_days<0) {
      offset_days = offset_days + 7;
    }
    offset_days = Math.trunc(offset_days);
  }

  if ((month==12)|| (month == 10) || (month == 7) || ( month== 5)) {
    if (offset_days == 0) {
      offset_days = 6;
    }
    else {
      offset_days -=1;
    }
  }

  let grouped_days = this.getWeeksArray(this_month_days, offset_days);

  return grouped_days.map((week_days, index) => {
      return (
          <View key={index} style={style.week_days}>
              { this.renderDays(week_days) }
          </View>
      );
  });
}

dot_the_day(day) {
  if (this.state.days_with_appointment.includes(day)) {
    return true;
  }
  else {
    return false;
  }
}

renderDays(week_days) {
  return week_days.map((day, index) => {
      return (
          day==' '?<Text key={index} style={[styles().txt,style.calendar_weekdays_text]}></Text>:
          (day==date && this.props.monthNumber== curr_month && this.props.currentYear == curr_year)?<Text
          onPress={()=>this._showModal(day, index)}
          key={index} style={styles().calendar_weekdays_today}>
            {day}
          </Text>:
          this.dot_the_day(day)==true?
          <View style={style.calendar_weekdays_cont}
            key={index}>
          <Entypo
            raised
            size= {1}
            underlayColor='grey'
            name='dot-single'
            style={{alignItems:'flex-start'}}
            />
          <Text
            onPress={()=>this._showModal(day, index)}
            style={[styles().txt,style.calendar_weekdays_text]}>{day}</Text>
            </View>:
          <Text
          onPress={()=>this._showModal(day, index)}
          key={index} style={[styles().txt,style.calendar_weekdays_text]}>{day}</Text>

      );
  });
}

getWeeksArray(days, offset) {
  var weeks_r = [];
  var seven_days = [];
  var count = offset;
  while (offset != 0) {
    seven_days.push(' ');
    offset = offset - 1;
  }
  days.forEach((day) => {
    count += 1;
    seven_days.push(day);
    if(count == 7){
      weeks_r.push(seven_days)
      count = 0;
      seven_days = [];
    }
  });
  if (count != 0){
    while (count < 7) {
      seven_days.push(' ');
      count ++;
    }
    weeks_r.push(seven_days);
  }
  return weeks_r;
}

render() {
  return(
        <View style={styles().cont}>
          {this.renderWeeks()}
          <View>
          <Text style={{flex:1}}>
          {this.state.days_with_appointment[0]}
          </Text>
          </View>
          <Calendar_pop_up
          isVisible={this.state.isModalVisible}
          items={[this.state.currentDay, this.props.monthNumber, this.props.currentYear,
            weekdays[this.state.weekIndex], MonthName[this.props.monthNumber]]}
          appointments={this.props.appointments}
          onClose= {this._hideModal}
          s_a={this.props.save_appointment}
          />
        </View>
  )

}

};

const style = StyleSheet.create({
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

  calendar_weekdays_cont: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    paddingBottom:3,
    paddingTop:5
  }

});
