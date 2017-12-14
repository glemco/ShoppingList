
import React from 'react';
import { Text, View, Modal, TextInput,
  TouchableHighlight, StyleSheet,
  ScrollView, TouchableWithoutFeedback } from 'react-native';
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './StyleSheet.js';
import DatePicker from 'react-native-datepicker';


export default class Calendar_pop_up extends React.Component{
  constructor(props){
    super(props);
    this.state={open:this.props.isVisible,
      appointment_description:'',
      appointment_location:'',
      appointment_hour:'12:00',
    };
  }

  /*
   * Change the state when props get updated (to be able to manage it
   * in here too
   */
  componentWillReceiveProps(newProps){
    this.setState({open:newProps.isVisible,selected:undefined});
  }

  /*
   * select the data to send and call the submit method, if the textbox
   * is selected, it's content will be sent instead
   */


  renderDayAppointments(){
    var items = this.props.items;
    var appoints = this.props.appointments;
    var to_render = [];
    for (var i=0; i<appoints.length; i++) {
      var appo_split = appoints[i].split("-");
      var appo_date = appo_split[0].split("/");
      if ((appo_date[0]==items[0])&&(appo_date[1]==items[1])&&(appo_date[2]==items[2])) {
        to_render.push(appoints[i]);
      }
    }
    return to_render.map((appointment, index)=>{
      return(
      <View key={index} style={styless.textinputstyle}
      >{this.presentAppointment(appointment)}</View>
    );
  });
  }

  presentAppointment(appointment) {
    var appo_split = appointment.split("-");
    var ret = "Time : " + appo_split[1] + "\n" + "Location : " + appo_split[2] + "\n"
    + "Description : " + appo_split[3];
    return(
      <Text style={{color:'white', fontSize:16}}>{ret}</Text>

    );
  }

  saving_description(description) {
    this.setState({appointment_description: description});
  }

  saving_location(location) {
    this.setState({appointment_location: location});
  }

  saving_hour(hour) {
    this.setState({appointment_hour:hour});
  }

  saving_new_appointment() {
    if (this.state.appointment_location==''||this.state.appointment_description=='') {
      return;
    }
    let items = this.props.items;
    var new_appointment = items[0] + "/" + items[1] + "/" +
    items[2] + "-" + this.state.appointment_hour + "-" +
    this.state.appointment_location + "-" + this.state.appointment_description;
    this.setState({open:false, appointment_description:'', appointment_location:'', appointment_hour:'12:00'});
    this.props.s_a(new_appointment);

  }

  closing(){
    this.setState({open:false});
    this.props.onClose();
  }
  /*
   * Modal structure with touchable area outside to close it, touchable
   * inside to ensure it won't close (basically it's doing nothing but
   * getting touches), a title in the top, the list with radio-like
   * buttons and a textbox in the end and finally the 2 buttons to submit
   * and close
   */
  render(){
    let items = this.props.items;
    return <Modal onRequestClose={() => null} animationType="fade"
      visible={this.state.open} transparent={true}>
      <TouchableWithoutFeedback onPress={this.closing.bind(this)}>
        <View style={styles().modBack}>
          <TouchableWithoutFeedback onPress={()=>null}>
            <View style={styles().modCont}>
              <View style={styles().modHead}>
                <Text style={styles().title}>
                  {items[3].toUpperCase() +" "+ items[0] + " " + items[4].toUpperCase()
                  + " " + items[2]}
                </Text>
              </View>
              {/*---------Start of the modal innards ------------------  */ }
              <ScrollView
              style={{height:400}}>
              <TouchableWithoutFeedback>
                <View>
                {this.renderDayAppointments()}

                <Text style={styles().title,{color:'white', padding:10}}>
                Add an Appointment :
                </Text>
                <TextInput
                style={[styless.textinputstyle, styles().txt]}
                onChangeText={(value)=>this.saving_description(value)}
                value={this.state.appointment_description}
                placeholder='Description'
                placeholderTextColor="#707070"
                />
                <TextInput
                style={[styless.textinputstyle, styles().txt]}
                onChangeText={(value)=>this.saving_location(value)}
                value={this.state.appointment_location}
                placeholder='Location'
                placeholderTextColor="#707070"
                />
                <DatePicker
                date={this.state.appointment_hour}
                onDateChange={(date)=>{this.saving_hour(date)}}
                mode="time"
                iconSource={require('../assets/images/clock.png')}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                style={{padding:10}}
                customStyles={
                  {dateText:styles().txt}
                }
                />
                </View>
              </TouchableWithoutFeedback>
              </ScrollView>
              {/*---------Start of the modal bottom pad ------------------  */ }
              <View
                style={styles().modFoot}>
                <TouchableHighlight
                  onPress={this.closing.bind(this)}>
                  <Text style={styles().modButt}>
                    CANCEL
                  </Text>
                </TouchableHighlight>
                <TouchableHighlight
                  onPress={this.saving_new_appointment.bind(this)}>
                  <Text style={styles().modButt}>
                    OK
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  }

}

const styless = StyleSheet.create({
textinputstyle:{
  padding:10,
  borderBottomWidth: 0.2,
  borderColor: 'white'
}
})
