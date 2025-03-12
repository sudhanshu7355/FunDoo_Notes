
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';

type Label = {
  id: string;
  name: string;
};

const LabelsScreen = () => {
  const navigation = useNavigation();
  const [labels, setLabels] = useState<Label[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newLabelName, setNewLabelName] = useState('');

  
  useEffect(() => {
    const loadLabels = async () => {
      try {
        const savedLabels = await AsyncStorage.getItem('labels');
        if (savedLabels) {
          setLabels(JSON.parse(savedLabels));
        }
      } catch (error) {
        console.error('Failed to load labels', error);
      }
    };
    loadLabels();
  }, []);

  
  useEffect(() => {
    const saveLabels = async () => {
      try {
        await AsyncStorage.setItem('labels', JSON.stringify(labels));
      } catch (error) {
        console.error('Failed to save labels', error);
      }
    };
    saveLabels();
  }, [labels]);

  const handleCreateLabel = () => {
    if (!newLabelName.trim()) {
      Alert.alert('Error', 'Please enter a label name');
      return;
    }
    const newLabel: Label = {
      id: Date.now().toString(),
      name: newLabelName.trim(),
    };
    setLabels([...labels, newLabel]);
    setNewLabelName('');
    Snackbar.show({
      text: 'Label created!',
      duration: Snackbar.LENGTH_SHORT,
    });
  };

  const handleDeleteLabel = (id: string) => {
    Alert.alert(
      'Delete Label',
      'Are you sure you want to delete this label?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setLabels(labels.filter(label => label.id !== id)),
        },
      ]
    );
  };

  const renderLabelItem = ({ item }: { item: Label }) => (
    <View style={styles.labelItem}>
      <View style={styles.labelContent}>
        <Icon name="label-outline" size={24} color="#202124" style={styles.labelIcon} />
        <Text style={styles.labelText}>{item.name}</Text>
      </View>
      {isEditing && (
        <TouchableOpacity onPress={() => handleDeleteLabel(item.id)}>
          <Icon name="delete" size={24} color="#202124" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#5F6368" />
        </TouchableOpacity>
        <Text style={styles.title}>Labels</Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={styles.editButton}>
          <Text style={styles.editText}>{isEditing ? 'Done' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={labels}
        renderItem={renderLabelItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No labels found</Text>
          </View>
        }
      />

     
      <View style={styles.createLabelContainer}>
        <TouchableOpacity style={styles.createLabelButton} onPress={handleCreateLabel}>
          <Icon name="add" size={24} color="#202124" style={styles.createIcon} />
          <TextInput
            style={styles.createInput}
            placeholder="Create new label"
            placeholderTextColor="#9AA0A6"
            value={newLabelName}
            onChangeText={setNewLabelName}
            onSubmitEditing={handleCreateLabel}
            returnKeyType="done"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#202124',
  },
  editButton: {
    padding: 8,
  },
  editText: {
    fontSize: 16,
    color: '#1A73E8',
  },
  labelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  labelContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelIcon: {
    marginRight: 12,
  },
  labelText: {
    fontSize: 16,
    color: '#202124',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#9E9E9E',
  },
  createLabelContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  createLabelButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createIcon: {
    marginRight: 12,
  },
  createInput: {
    flex: 1,
    fontSize: 16,
    color: '#202124',
  },
});

export default LabelsScreen;