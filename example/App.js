import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Switch,
} from 'react-native';
import moment from 'moment';
import CalendarPicker from './CalendarPicker';

export default class App extends Component {
  constructor(props) {
    super(props);

    let minDate = moment().subtract(15, 'day');
    let day = minDate.clone();
    let customDatesStyles = [];
    for (let i = 0; i < 30; i++) {
      customDatesStyles.push({
        date: day.clone(),
        // Random colors
        style: {backgroundColor: '#'+('#00000'+(Math.random()*(64<<22)|32768).toString(16)).slice(-6)},
        textStyle: {color: 'black'}, // sets the font color
        containerStyle: [], // extra styling for day container
      });
      day.add(1, 'day');
    }

    this.state = {
      customDatesStyles,
      enableRangeSelect: false,
      minDate,
      maxDate: moment().add(90, 'day'),
      minRangeDuration: "1",
      maxRangeDuration: "5",
      selectedStartDate: null,
    };
    this.onDateChange = this.onDateChange.bind(this);
    this.clear = this.clear.bind(this);
    this.toggleEnableRange = this.toggleEnableRange.bind(this);
    this.onMinRangeDuration = this.onMinRangeDuration.bind(this);
    this.onMaxRangeDuration = this.onMaxRangeDuration.bind(this);
  }

  onDateChange(date, type) {
    if (type === "START_DATE") {
      this.setState({
        selectedStartDate: date,
      });
    }
    else {
      this.setState({
        selectedEndDate: date,
      });
    }
  }

  clear() {
    this.setState({
      selectedStartDate: null,
      selectedEndDate: null,
    });
  }

  toggleEnableRange(text) {
    this.setState({
      enableRangeSelect: !this.state.enableRangeSelect,
      selectedStartDate: null,
      selectedEndDate: null,
    });
  }

  onMinRangeDuration(val) {
    let parsedVal = parseInt(val);
    this.setState({
      minRangeDuration: val && !isNaN(parsedVal) ? parsedVal + "" : undefined,
      selectedStartDate: null,
      selectedEndDate: null,
    });
  }

  onMaxRangeDuration(val) {
    let parsedVal = parseInt(val);
    this.setState({
      maxRangeDuration: val && !isNaN(parsedVal) ? parsedVal + "" : undefined,
      selectedStartDate: null,
      selectedEndDate: null,
    });
  }

  customDayHeaderStylesCallback({dayOfWeek, month, year}) {
    switch(dayOfWeek) {
      case 4: // Thursday
        return {
          style: {
            borderRadius: 12,
            backgroundColor: 'cyan',
          },
          textStyle: {
            color: 'blue',
            fontWeight: 'bold',
          }
        };
    }
  }

  render() {
    const {
      customDatesStyles,
      enableRangeSelect,
      minDate,
      maxDate,
      minRangeDuration,
      maxRangeDuration,
      selectedStartDate,
      selectedEndDate,
    } = this.state;
    const formattedStartDate = selectedStartDate ? selectedStartDate.format('YYYY-MM-DD') : '';
    const formattedEndDate = selectedEndDate ? selectedEndDate.format('YYYY-MM-DD') : '';

    return (
      <View style={styles.container}>
        <CalendarPicker
          startFromMonday={true}
          weekdays={['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']}
          months={['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']}
          selectedDayStyle={{backgroundColor: 'green', color: 'white'}}
          selectedDayColor={'white'}
          selectedDayTextColor={'white'}
          todayBackgroundColor={'white'}
          dayLabelsWrapper={{borderBottomWidth: 0, borderTopWidth: 0}}
          todayTextStyle={{ color: 'white'}}
          showDayStragglers={true}
          selectedDates={['2021-09-02', '2021-09-18']}
          selectedDatesIcon={<Text width={24} height={21} style={{ color: 'green', marginTop: 15 }}>P</Text>}
          rangeSelectedDates={[{
            startDate: '2021-09-19',
            endDate: '2021-09-25',
            title: 'Griechenland'
          },
          {
            startDate: '2021-09-30',
            endDate: '2021-09-30',
            title: 'Christmas'
          }]}
          rangeSelectedDatesIcon={<Text width={25} height={25} style={{ color: 'white' }}>D</Text> }
          selectedRangeStyle={{backgroundColor: 'rgba(82, 44, 24, .5)', height: 38, marginTop: 4, paddingLeft: 14 }}
          width={370}
          height = {390}
        />

        <View style={styles.topSpacing}>
          <Text style={styles.text}>Selected (Start) date:  { formattedStartDate }</Text>
          { !!formattedEndDate &&
            <Text style={styles.text}>Selected End date:  { formattedEndDate }</Text>
          }
        </View>

        <View style={styles.topSpacing}>
          <Button onPress={this.clear} title="Clear Selection"/>
        </View>

        <View style={styles.topSpacing}>
          <Text style={styles.text}>Range select:</Text>
        </View>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={enableRangeSelect ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={this.toggleEnableRange}
          value={enableRangeSelect}
        />

        { enableRangeSelect &&
          <View>
            <Text style={styles.text}>minRangeDuration:</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={this.onMinRangeDuration}
              value={minRangeDuration || ""}
              keyboardType={"number-pad"}
            />

            <Text style={styles.text}>maxRangeDuration:</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={this.onMaxRangeDuration}
              value={maxRangeDuration || ""}
              keyboardType={"number-pad"}
            />
          </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 100,
    alignItems: 'center',
  },
  topSpacing: {
    marginTop:20
  },
  text: {
    fontSize: 24,
  },
  textInput: {
    height: 40,
    fontSize: 24,
    borderColor: 'gray',
    borderWidth: 1,
  },
  headerWrapperStyle: {
    backgroundColor: '#ffbdab',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 20,
  }
});
