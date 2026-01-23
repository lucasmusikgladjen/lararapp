import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Header = ({ title, leftButton, rightButton, onLeftPress, onRightPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {leftButton && (
          <TouchableOpacity onPress={onLeftPress}>
            <Text style={styles.buttonText}>{leftButton}</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.rightContainer}>
        {rightButton && (
          <TouchableOpacity onPress={onRightPress}>
            <Text style={styles.buttonText}>{rightButton}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  leftContainer: {
    width: 80,
  },
  rightContainer: {
    width: 80,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  buttonText: {
    color: '#007AFF',
    fontSize: 16,
  },
});

export default Header;
