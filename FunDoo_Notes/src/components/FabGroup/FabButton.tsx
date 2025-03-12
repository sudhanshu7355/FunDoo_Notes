import React from 'react';
import { TouchableOpacity, Text, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';

type FabButtonProps = {
  icon: string;
  label: string;
  onPress: () => void;
  style?: ViewStyle;
};

export const FabButton = ({ icon, label, onPress, style }: FabButtonProps) => (
  <TouchableOpacity style={[styles.subButton, style]} onPress={onPress}>
    <Icon name={icon} size={24} color="white" />
    <Text style={styles.subButtonText}>{label}</Text>
  </TouchableOpacity>
);




