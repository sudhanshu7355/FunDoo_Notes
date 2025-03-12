
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SettingsScreen = () => {
  const navigation = useNavigation();

  
  const [addNewToBottom, setAddNewToBottom] = useState(false);
  const [moveTickedToBottom, setMoveTickedToBottom] = useState(false);
  const [displayRichPreviews, setDisplayRichPreviews] = useState(false);
  const [theme, setTheme] = useState('Light');
  const [reminderDefaults, setReminderDefaults] = useState({
    morning: '8:00 am',
    afternoon: '1:00 pm',
    evening: '6:00 pm',
  });
  const [enableSharing, setEnableSharing] = useState(false);

  
  useEffect(() => {
    
  }, [addNewToBottom, moveTickedToBottom, displayRichPreviews, theme, reminderDefaults, enableSharing]);

  const handleReminderChange = (timeOfDay: 'morning' | 'afternoon' | 'evening', value: string) => {
    setReminderDefaults(prev => ({
      ...prev,
      [timeOfDay]: value,
    }));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>Settings</Text>

      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Display options</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Add new items to bottom</Text>
          <Switch
            value={addNewToBottom}
            onValueChange={setAddNewToBottom}
            trackColor={{ false: '#D3D3D3', true: '#4CAF50' }}
            thumbColor={addNewToBottom ? '#FFF' : '#FFF'}
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Move ticked items to bottom</Text>
          <Switch
            value={moveTickedToBottom}
            onValueChange={setMoveTickedToBottom}
            trackColor={{ false: '#D3D3D3', true: '#4CAF50' }}
            thumbColor={moveTickedToBottom ? '#FFF' : '#FFF'}
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Display rich link previews</Text>
          <Switch
            value={displayRichPreviews}
            onValueChange={setDisplayRichPreviews}
            trackColor={{ false: '#D3D3D3', true: '#4CAF50' }}
            thumbColor={displayRichPreviews ? '#FFF' : '#FFF'}
          />
        </View>
      </View>

      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Theme</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Theme</Text>
          <Text style={styles.settingValue}>{theme}</Text>
          
        </View>
      </View>

      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reminder defaults</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Morning</Text>
          <TextInput
            style={styles.timeInput}
            value={reminderDefaults.morning}
            onChangeText={(value) => handleReminderChange('morning', value)}
            keyboardType="default"
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Afternoon</Text>
          <TextInput
            style={styles.timeInput}
            value={reminderDefaults.afternoon}
            onChangeText={(value) => handleReminderChange('afternoon', value)}
            keyboardType="default"
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Evening</Text>
          <TextInput
            style={styles.timeInput}
            value={reminderDefaults.evening}
            onChangeText={(value) => handleReminderChange('evening', value)}
            keyboardType="default"
          />
        </View>
      </View>

      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sharing</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Enable sharing</Text>
          <Switch
            value={enableSharing}
            onValueChange={setEnableSharing}
            trackColor={{ false: '#D3D3D3', true: '#4CAF50' }}
            thumbColor={enableSharing ? '#FFF' : '#FFF'}
          />
        </View>
      </View>

      
      <TouchableOpacity style={styles.reloadButton}>
        <Text style={styles.reloadText}>Reload my account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  backButton: {
    padding: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#202124',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#202124',
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  settingText: {
    fontSize: 16,
    color: '#202124',
  },
  settingValue: {
    fontSize: 16,
    color: '#757575',
  },
  timeInput: {
    fontSize: 16,
    color: '#202124',
    width: 100,
    textAlign: 'right',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  reloadButton: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'center',
  },
  reloadText: {
    fontSize: 16,
    color: '#1A73E8',
  },
});

export default SettingsScreen;