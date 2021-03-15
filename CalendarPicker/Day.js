import React from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

export default function Day(props) {
  const {
    day,
    month,
    year,
    styles,
    customDatesStyles,
    onPressDay,
    selectedStartDate,
    selectedEndDate,
    allowRangeSelection,
    allowBackwardRangeSelect,
    selectedDayStyle: propSelectedDayStyle,
    selectedDisabledDatesTextStyle,
    selectedRangeStartStyle,
    selectedRangeStyle,
    selectedRangeEndStyle,
    textStyle,
    todayTextStyle,
    selectedDayTextStyle: propSelectedDayTextStyle,
    selectedRangeStartTextStyle,
    selectedRangeEndTextStyle,
    minDate,
    maxDate,
    disabledDates,
    disabledDatesTextStyle,
    minRangeDuration,
    maxRangeDuration,
    enableDateChange,
    selectedDates,
    selectedDatesIcon,
    rangeSelectedDates,
    rangeSelectedDatesIcon,
  } = props;

  const thisDay = moment({year, month, day, hour: 12 });
  const today = moment();

  let dateOutOfRange;
  let computedSelectedDayStyle = styles.dayButton; // may be overridden depending on state
  let computedRangeSelectedDayStyle = {};
  let containerSelectedDayStyle = {};
  let selectedDayTextStyle = {};
  let selectedDayStyle;
  let overrideOutOfRangeTextStyle;
  let dateIsBeforeMin = false;
  let dateIsAfterMax = false;
  let dateIsDisabled = false;
  let dateRangeLessThanMin = false;
  let dateRangeGreaterThanMax = false;

  // First let's check if date is out of range
  // Check whether props maxDate / minDate are defined. If not supplied,
  // don't restrict dates.
  if (maxDate) {
    dateIsAfterMax = thisDay.isAfter(maxDate, 'day');
  }
  if (minDate) {
    dateIsBeforeMin = thisDay.isBefore(minDate, 'day');
  }

  if (disabledDates) {
    if (Array.isArray(disabledDates) && disabledDates.indexOf(thisDay.valueOf()) >= 0) {
      dateIsDisabled = true;
    }
    else if (disabledDates instanceof Function) {
      dateIsDisabled = disabledDates(thisDay);
    }
  }

  if (allowRangeSelection && selectedStartDate && !selectedEndDate) {
    let daysDiff = thisDay.diff(selectedStartDate, 'days'); // may be + or -
    daysDiff = allowBackwardRangeSelect ? Math.abs(daysDiff) : daysDiff;

    if (maxRangeDuration) {
      if (Array.isArray(maxRangeDuration)) {
        let maxRangeEntry = maxRangeDuration.find(mrd => selectedStartDate.isSame(mrd.date, 'day') );
        if (maxRangeEntry && daysDiff > maxRangeEntry.maxDuration) {
          dateRangeGreaterThanMax = true;
        }
      } else if(daysDiff > maxRangeDuration) {
        dateRangeGreaterThanMax = true;
      }
    }

    if (minRangeDuration) {
      if (Array.isArray(minRangeDuration)) {
        let minRangeEntry = minRangeDuration.find(mrd => selectedStartDate.isSame(mrd.date, 'day') );
        if (minRangeEntry && daysDiff < minRangeEntry.minDuration) {
          dateRangeLessThanMin = true;
        }
      } else if(daysDiff < minRangeDuration) {
        dateRangeLessThanMin = true;
      }
    }

    if (!allowBackwardRangeSelect && daysDiff < 0) {
      dateRangeLessThanMin = true;
    }
  }

  dateOutOfRange = dateIsAfterMax || dateIsBeforeMin || dateIsDisabled || dateRangeLessThanMin || dateRangeGreaterThanMax;

  let isThisDaySameAsSelectedStart = thisDay.isSame(selectedStartDate, 'day');
  let isThisDaySameAsSelectedEnd = thisDay.isSame(selectedEndDate, 'day');
  let isThisDateInSelectedRange =
    selectedStartDate
    && selectedEndDate
    && thisDay.isBetween(selectedStartDate, selectedEndDate,'day','[]');
  // rewrite variable
  let isThisDayTitle = ''
  isThisDaySameAsSelectedStart = false
  isThisDaySameAsSelectedEnd = false
  isThisDateInSelectedRange = false
  let isThisDayBeforeSelected = false
  if(selectedDates) {
    isThisDayBeforeSelected = selectedDates.some(date => thisDay.isSame(date, 'day'))
  }

  if (rangeSelectedDates) {
    for(const item of rangeSelectedDates) {
      isThisDaySameAsSelectedStart = thisDay.isSame(item.startDate, 'day');
      isThisDaySameAsSelectedEnd = thisDay.isSame(item.endDate, 'day');
      isThisDateInSelectedRange =
        item.startDate
        && item.endDate
        && thisDay.isBetween(item.startDate, item.endDate,'day','[]');

      if(isThisDaySameAsSelectedStart || isThisDaySameAsSelectedEnd || isThisDateInSelectedRange) {
        isThisDayTitle = item.title
        // Apply style for start date
        if (isThisDaySameAsSelectedStart) {
          computedRangeSelectedDayStyle = [styles.startDayWrapper, selectedRangeStyle, selectedRangeStartStyle, styles.rangeDatesSelectedStyle];
          selectedDayTextStyle = [styles.selectedDayLabel, propSelectedDayTextStyle, selectedRangeStartTextStyle];
          containerSelectedDayStyle = {zIndex: 3};
        }
        // Apply style for end date
        if (isThisDaySameAsSelectedEnd) {
          computedRangeSelectedDayStyle = [styles.endDayWrapper, selectedRangeStyle, selectedRangeEndStyle];
          selectedDayTextStyle = [styles.selectedDayLabel, propSelectedDayTextStyle, selectedRangeEndTextStyle];
        }
        // Apply style if start date is the same as end date
        if (isThisDaySameAsSelectedEnd &&
            isThisDaySameAsSelectedStart &&
            item.endDate.isSame(item.startDate, 'day'))
        {
          computedRangeSelectedDayStyle = [styles.selectedDay, styles.selectedDayBackground, selectedRangeStyle];
          selectedDayTextStyle = [styles.selectedDayLabel, propSelectedDayTextStyle, selectedRangeStartTextStyle];
        }
        // Apply style for days inside of range, excluding start & end dates.
        if (thisDay.isBetween(item.startDate, item.endDate, 'day', '()')) {
          computedRangeSelectedDayStyle = [styles.inRangeDay, selectedRangeStyle];
          selectedDayTextStyle = [styles.selectedDayLabel, propSelectedDayTextStyle];
        }
        break;
      }
    }
  }

  // If date is in range let's apply styles
  if (!dateOutOfRange || isThisDaySameAsSelectedStart || isThisDaySameAsSelectedEnd || isThisDateInSelectedRange) {
    // set today's style
    let isToday = thisDay.isSame(today, 'day');
    if (isToday) {
      computedSelectedDayStyle = styles.selectedToday;
      // todayTextStyle prop overrides selectedDayTextColor (created via makeStyles)
      selectedDayTextStyle = [todayTextStyle || styles.selectedDayLabel, propSelectedDayTextStyle];
    }

    const custom = getCustomDateStyle({customDatesStyles, date: thisDay});

    if (isToday && custom.style) {
      // Custom date style overrides 'today' style. It may be reset below
      // by date selection styling.
      computedSelectedDayStyle = [styles.selectedToday, custom.style];
    }

    // set selected day style
    if (!allowRangeSelection &&
        selectedStartDate &&
        isThisDaySameAsSelectedStart)
    {
      computedSelectedDayStyle = styles.selectedDay;
      selectedDayTextStyle = [styles.selectedDayLabel, isToday && todayTextStyle, propSelectedDayTextStyle];
      // selectedDayStyle prop overrides selectedDayColor (created via makeStyles)
      selectedDayStyle = propSelectedDayStyle || styles.selectedDayBackground;
    }

    // Set selected ranges styles
    if (allowRangeSelection) {
      if (selectedStartDate && selectedEndDate) {
        // Apply style for start date
        if (isThisDaySameAsSelectedStart) {
          computedSelectedDayStyle = [styles.startDayWrapper, selectedRangeStyle, selectedRangeStartStyle];
          selectedDayTextStyle = [styles.selectedDayLabel, propSelectedDayTextStyle, selectedRangeStartTextStyle];
        }
        // Apply style for end date
        if (isThisDaySameAsSelectedEnd) {
          computedSelectedDayStyle = [styles.endDayWrapper, selectedRangeStyle, selectedRangeEndStyle];
          selectedDayTextStyle = [styles.selectedDayLabel, propSelectedDayTextStyle, selectedRangeEndTextStyle];
        }
        // Apply style if start date is the same as end date
        if (isThisDaySameAsSelectedEnd &&
            isThisDaySameAsSelectedStart &&
            selectedEndDate.isSame(selectedStartDate, 'day'))
        {
          computedSelectedDayStyle = [styles.selectedDay, styles.selectedDayBackground, selectedRangeStyle];
          selectedDayTextStyle = [styles.selectedDayLabel, propSelectedDayTextStyle, selectedRangeStartTextStyle];
        }
        // Apply style for days inside of range, excluding start & end dates.
        if (thisDay.isBetween(selectedStartDate, selectedEndDate, 'day', '()')) {
          computedSelectedDayStyle = [styles.inRangeDay, selectedRangeStyle];
          selectedDayTextStyle = [styles.selectedDayLabel, propSelectedDayTextStyle];
        }
      }
      // Apply style if start date has been selected but end date has not
      if (selectedStartDate &&
          !selectedEndDate &&
          isThisDaySameAsSelectedStart)
      {
        computedSelectedDayStyle = [styles.startDayWrapper, selectedRangeStyle, selectedRangeStartStyle];
        selectedDayTextStyle = [styles.selectedDayLabel, propSelectedDayTextStyle, selectedRangeStartTextStyle];
        // Override out of range start day text style when minRangeDuration = 1.
        // This allows selected start date's text to be styled by selectedRangeStartTextStyle
        // even when it's below minRangeDuration.
        overrideOutOfRangeTextStyle = selectedRangeStartTextStyle;
      }
    }

    if (dateOutOfRange) { // start or end date selected, and this date outside of range.
      return (
        <View style={[styles.dayWrapper, custom.containerStyle]}>
          <View style={[custom.style, computedSelectedDayStyle, selectedDayStyle ]}>
            <Text style={[styles.dayLabel, textStyle,
              styles.disabledText, disabledDatesTextStyle,
              styles.selectedDisabledText, selectedDisabledDatesTextStyle,
              overrideOutOfRangeTextStyle
            ]}>
              { day }
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={[styles.dayWrapper, custom.containerStyle]}>
          <TouchableOpacity
            disabled={!enableDateChange}
            style={[custom.style, computedSelectedDayStyle, selectedDayStyle ]}
            onPress={() => onPressDay({year, month, day}) }>
            <Text style={[styles.dayLabel, textStyle, custom.textStyle]}>
              { day }
            </Text>
          </TouchableOpacity>
          <View
            style={[computedRangeSelectedDayStyle, selectedDayStyle]}
          >
            { isThisDaySameAsSelectedStart && rangeSelectedDatesIcon && (<View style={{marginRight: 8}}>{ rangeSelectedDatesIcon }</View>) }
            { isThisDaySameAsSelectedStart && isThisDayTitle && (<Text style={[styles.rangeDatesSelectedTitleStyle]}>{ isThisDayTitle }</Text>) }
          </View>
          <View>
            { isThisDayBeforeSelected && selectedDatesIcon && (<View>{ selectedDatesIcon }</View>) }
          </View>
        </View>
      );
    }
  }
  else {  // dateOutOfRange = true, and no selected start or end date.
    const custom = getCustomDateStyle({customDatesStyles, date: thisDay});
    // Allow customDatesStyles to override disabled dates if allowDisabled set
    if (!custom.allowDisabled) {
      custom.containerStyle = null;
      custom.style = null;
      custom.textStyle = null;
    }
    return (
      <View style={[styles.dayWrapper, custom.containerStyle, styles.dayEmpty]}>
        <View style={[styles.dayButton, custom.style]}>
          <Text style={[textStyle, styles.disabledText, disabledDatesTextStyle, custom.textStyle]}>
            { day }
          </Text>
        </View>
        <View>
          { isThisDayBeforeSelected && selectedDatesIcon && (<View>{ selectedDatesIcon }</View>) }
        </View>
      </View>
    );
  }
}

function getCustomDateStyle({customDatesStyles, date}) {
  if (Array.isArray(customDatesStyles)) {
    for (let cds of customDatesStyles) {
      if (date.isSame(moment(cds.date), 'day')) {
        return {...cds};
      }
    }
  }
  else if (customDatesStyles instanceof Function) {
    let cds = customDatesStyles(date) || {};
    return {...cds};
  }
  return {};
}

Day.defaultProps = {
  customDatesStyles: [],
};

Day.propTypes = {
  styles: PropTypes.shape({}),
  day: PropTypes.number,
  onPressDay: PropTypes.func,
  disabledDates: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
  minRangeDuration: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
  maxRangeDuration: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
};
