import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const permitTypes = [
  { label: 'R', value: 'R' },
  { label: 'S', value: 'S' },
  { label: 'E', value: 'E' },
  { label: 'GZ', value: 'GZ' },
];

const DropdownComp = ({ value, setValue, borderColor }) => {
  const [isFocus, setIsFocus] = useState(false);

  const containerStyle = [styles.container, { borderColor: borderColor }];

  return (
    <View style={containerStyle}>
      <Dropdown
        style={[styles.dropdown]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        iconStyle={styles.iconStyle}
        data={permitTypes}
        maxHeight={300}
        labelField="label"
        valueField="value"
        activeColor='#f3f4f6'
        placeholder={!isFocus ? 'Permit' : '...'}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          setIsFocus(false);
        }}
      />
    </View>
  );
};

export default DropdownComp;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 8,
  },
  dropdown: {
    height: 50,
    paddingHorizontal: 16,
  },
  placeholderStyle: {
    fontSize: 14,
    color: '#9ca3af'
  },
  selectedTextStyle: {
    fontSize: 14,
  },
});