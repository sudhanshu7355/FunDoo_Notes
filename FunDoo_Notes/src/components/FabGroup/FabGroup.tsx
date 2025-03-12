import React, { useState } from 'react';
import { Animated, Easing, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FabButton } from './FabButton';
import { styles } from './styles';

type FabGroupProps = {
  onImagePress: () => void;
  onDrawingPress: () => void;
  onListPress: () => void;
  onTextPress: () => void;
};

export const FabGroup = ({ 
  onImagePress,
  onDrawingPress,
  onListPress,
  onTextPress,
 }: FabGroupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const animationValue = new Animated.Value(0);

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    Animated.timing(animationValue, {
      toValue,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => setIsOpen(!isOpen));
  };

  const subButtons = [
    { icon: 'image', label: 'Image', action: onImagePress },
    { icon: 'brush', label: 'Drawing', action: onDrawingPress },
    { icon: 'list', label: 'List', action: onListPress },
    { icon: 'text-fields', label: 'Text', action: onTextPress },
  ];

  const buttonAnimation = (index: number) => ({
    opacity: animationValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
    transform: [
      { scale: animationValue },
      {
        translateY: animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -(index * 60 + 60)],
        }),
      },
    ],
  });

  return (
    <>
      {subButtons.map((btn, index) => (
        <Animated.View
          key={btn.label}
          style={[
            styles.subFab,
            buttonAnimation(index),
            { bottom: 24, right: 24 },
          ]}
        >
          <FabButton
            icon={btn.icon}
            label={btn.label}
            onPress={() => {
              btn.action();
              toggleMenu();
            }}
          />
        </Animated.View>
      ))}

      <TouchableOpacity 
        style={styles.fab} 
        onPress={toggleMenu}
        activeOpacity={0.9}
      >
        <Animated.View style={{
          transform: [{
            rotate: animationValue.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '45deg']
            })
          }]
        }}>
          <Icon name="add" size={30} color="white" />
        </Animated.View>
      </TouchableOpacity>
    </>
  );
};
export default FabGroup;





