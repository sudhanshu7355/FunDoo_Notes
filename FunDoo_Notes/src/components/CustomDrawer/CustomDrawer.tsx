
import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { NotesContext } from '../../context/NotesContext'; 

const CustomDrawer: React.FC<DrawerContentComponentProps> = ({ navigation }) => {
  const { setNotes } = useContext(NotesContext); 
  const [focusedItem, setFocusedItem] = useState<string | null>(null);

  const menuItems = [
    {
      icon: 'note',
      label: 'Notes',
      onPress: () => navigation.navigate('MainStack', { screen: 'Notes' }),
    },
    {
      icon: 'notifications',
      label: 'Reminders',
      onPress: () => navigation.navigate('MainStack', { screen: 'Notes' }),
    },
    {
      icon: 'label',
      label: 'Labels',
      onPress: () => navigation.navigate('MainStack', { screen: 'Labels' }),
    },
    {
      icon: 'archive',
      label: 'Archive',
      onPress: () => navigation.navigate('MainStack', { screen: 'Archive' }),
    },
    {
      icon: 'delete',
      label: 'Trash',
      onPress: () => navigation.navigate('MainStack', { screen: 'Trash' }),
    },
    {
      icon: 'settings',
      label: 'Settings',
      onPress: () => navigation.navigate('Settings'),
    },
    {
      icon: 'help',
      label: 'Help',
      onPress: () => navigation.navigate('MainStack', { screen: 'Help' }),
    },
  ];

  
  const labels = [];

  const handleLabelPress = (labelName: string) => {
    navigation.navigate('MainStack', {
      screen: 'Notes',
      params: { filterByLabel: labelName },
    });
  };

  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            
            setNotes([]);
            
            try {
              await AsyncStorage.removeItem('notes');
            } catch (error) {
              console.error('Failed to clear notes from AsyncStorage', error);
            }
            
            navigation.reset({
              index: 0,
              routes: [{ name: 'MainStack', params: { screen: 'Login' } }],
            });
          },
        },
      ]
    );
  };

  const googleColors = [
    '#4285F4', 
    '#DB4437', 
    '#F4B400', 
    '#0F9D58', 
    '#DB4437', 
    '#4285F4', 
  ];

  return (
    <DrawerContentScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          {['G', 'o', 'o', 'g', 'l', 'e'].map((letter, index) => (
            <Text key={index} style={[styles.titleLetter, { color: googleColors[index] }]}>
              {letter}
            </Text>
          ))}
          <Text style={[styles.titleLetter, { color: '#4285F4' }]}> Keep</Text>
        </View>
      </View>

      {menuItems.map((item, index) => (
        <React.Fragment key={index}>
          <TouchableOpacity
            style={[
              styles.menuItem,
              focusedItem === item.label && styles.focusedItem,
            ]}
            onPress={item.onPress}
            onPressIn={() => setFocusedItem(item.label)}
            onPressOut={() => setFocusedItem(null)}
          >
            <Icon name={item.icon} size={24} color="#5F6368" />
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
          {item.label === 'Labels' && labels.length > 0 && (
            <View style={styles.labelsSection}>
              {labels.map((label, labelIndex) => (
                <TouchableOpacity
                  key={labelIndex}
                  style={[
                    styles.labelItem,
                    focusedItem === `label-${label.id}` && styles.focusedItem,
                  ]}
                  onPress={() => handleLabelPress(label.name)}
                  onPressIn={() => setFocusedItem(`label-${label.id}`)}
                  onPressOut={() => setFocusedItem(null)}
                >
                  <Icon name="label" size={24} color="#5F6368" />
                  <Text style={styles.label}>{label.name}</Text>
                </TouchableOpacity>
              ))}
              <View style={styles.separator} />
            </View>
          )}
        </React.Fragment>
      ))}

      
      <TouchableOpacity
        style={[styles.menuItem, focusedItem === 'logout' && styles.focusedItem]}
        onPress={handleLogout} 
        onPressIn={() => setFocusedItem('logout')}
        onPressOut={() => setFocusedItem(null)}
      >
        <Icon name="exit-to-app" size={24} color="#5F6368" />
        <Text style={styles.label}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.versionText}>v1.0.0</Text>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#E0F2F1',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#B2DFDB',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  titleLetter: {
    fontSize: 20,
    fontWeight: '500',
    marginRight: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    color: '#202124',
    marginLeft: 24,
  },
  labelsSection: {
    paddingHorizontal: 20,
    paddingLeft: 48,
  },
  labelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#B2DFDB',
    marginTop: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  versionText: {
    color: '#5F6368',
    fontSize: 12,
  },
  focusedItem: {
    backgroundColor: '#00BCD4',
  },
});

export default CustomDrawer;