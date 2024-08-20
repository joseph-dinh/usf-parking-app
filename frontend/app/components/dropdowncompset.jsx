import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const permitTypes = [
  { label: 'R', value: 'R' },
  { label: 'S', value: 'S' },
  { label: 'E', value: 'E' },
  { label: 'GZ', value: 'GZ' },
];

const DropdownCompSet = ({ value, setValue, borderColor, placeholderVal }) => {
  const [isFocus, setIsFocus] = useState(false);

  const containerStyle = [styles.container, { borderColor: borderColor }];

  const [placeholderText, setPlaceHolderText] = useState("Permit");

  useEffect(() => {
    if (placeholderVal) {
      setPlaceHolderText(placeholderVal);
    }
  }, [placeholderVal])

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
        placeholder={!isFocus ? placeholderText : '...'}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          setIsFocus(false);
        }}
      />
              {/* <View className="mt-10 mx-8 px-4 flex flex-row items-center bg-white border-[1px] border-neutral-100 shadow-lg rounded-lg space-x-2">
          <MaterialCommunityIcons name="email-outline" color={"#d4d4d4"} size={30}/>
        </View> */}
    </View>
  );
};

export default DropdownCompSet;


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 8,
  },
  dropdown: {
    height: 60,
    paddingHorizontal: 16,
  },
  placeholderStyle: {
    fontSize: 18,
    color: '#9ca3af'
  },
  selectedTextStyle: {
    fontSize: 14,
  },
});