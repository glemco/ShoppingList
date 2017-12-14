import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Button,

} from 'react-native';
import { WebBrowser } from 'expo';
import {  Icon } from 'react-native-elements';
import { MonoText } from '../components/StyledText';
import Month from './Month.js';
import styling from './StyleSheet.js';


import { range } from 'lodash';

const curr_month = new Date().getMonth()+1;
const curr_year = new Date().getFullYear();

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
      appointments:["24/12/2017-18:00-Home-Christmas Dinner",
                    "31/12/2017-22:00-Copenhagen Radhus Plads-New Year's Celebration",
                    "16/12/2017-10:00-Appartment-Prepare for trip Home",
                    "16/12/2017-12:00-Appartment-Do laundry",
                    "16/12/2017-15:00-Horsens' Train station-Take train to Odense"]
    }
  }



  saving_new_appointment(appointment){
    var appointments_old = this.state.appointments.slice();
    appointments_old.push(appointment);
    this.setState({appointments:appointments_old});
  }

  renderWeekDays() {
      let weekdays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
      return weekdays.map((day) => {
          return (
              <Text key={day} style={styles.calendar_weekdays_text}>{day.toUpperCase()}</Text>
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
          <Text style={[styles.header_text, styles.text_center, styles.bold_text]}>Calendar</Text>
        </View>
        <View>
          <TouchableHighlight
          onPress={this.set_to_today}
          style={{flex:1}}>
            <Text
            style={[styles.header_text, styles.text_right]}>Today</Text>
          </TouchableHighlight>
        </View>
      </View>
      {/*---------Start of the Calendar header ------------------  */ }
      <View style={styles.header}>
        <View style={styles.calendar_header}>
          <View style={styles.calendar_header_item}>
              <Icon
                onPress={this.oneYearLess}
                reverse
                raised
                size= {20}
                underlayColor='grey'
                name='chevron-left'
                style={{alignItems:'flex-start'}}
                />
              <Text style={styles.calendar_header_text}>{this.state.Year}</Text>
              <Icon
                onPress={this.oneYearMore}
                reverse
                raised
                size={20}
                name='chevron-right' />
          </View>
          <View style={styles.calendar_header_item}>
          <Icon
            onPress={this.oneMonthLess}
            reverse
            raised
            size= {20}
            underlayColor='grey'
            name='chevron-left' />
          <Text style={styles.calendar_header_text}>{this.state.Months[this.state.Month]}</Text>
          <Icon
            onPress={this.oneMonthMore}
            reverse
            raised
            size={20}
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
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'black',
    flexDirection: 'row',
    paddingTop: 5
  },
  header_item: {
    flex: 1
  },
  text_center: {
    textAlign: 'center',
    paddingLeft:20
  },
  text_right: {
      textAlign: 'right',
      paddingRight: 25
  },
  header_text: {
      color: 'yellow',
      fontSize: 20
  },
  bold_text: {
      fontWeight: 'bold'
  },
  calendar_header: {
    flexDirection: 'row',
    flex:1,
    justifyContent:'space-around'
},
calendar_header_item: {
    //backgroundColor:'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    //borderWidth:1,
    //borderColor:'white',
    alignItems: 'center',
    //paddingRight: 70,
    //paddingLeft: 70,
},
calendar_header_text: {
    //flex:1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    color:'yellow'
},
calendar_weekdays: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row'
    //color: '#C0C0C0',
    //textAlign: 'center'
},

day: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 17,
    margin: 2
},
day_text: {
    flex:1,
    paddingTop: 5,
    paddingBottom: 5,
    textAlign: 'center',
    color: '#A9A9A9',
    fontSize: 20
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
