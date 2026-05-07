import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const Card = ({ children, style }) => {
  const { theme } = useTheme();
  
  return (
    <View style={[
      styles.card, 
      { 
        backgroundColor: theme.card, 
        borderColor: theme.border,
        shadowColor: theme.text 
      }, 
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
  },
});

export default Card;
