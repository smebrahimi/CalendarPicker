import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

export default function EmptyDay(props) {
  const { styles } = props;
  return(
    <View style={[styles.dayWrapper, styles.dayEmpty]}>
      <View style={styles.dayButton} />
    </View>
  );
}

EmptyDay.propTypes = {
  styles: PropTypes.shape({})
};
