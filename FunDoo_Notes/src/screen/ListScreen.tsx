
import React, { useState, useEffect, useContext } from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NotesContext, Note } from '../context/NotesContext';

type ListItem = {
  id: string;
  text: string;
};

type ListNote = Note & {
  type: 'list';
  items: ListItem[];
};

const ListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { setNotes } = useContext(NotesContext);
  const existingNote = route.params?.note as ListNote | undefined;

  const [title, setTitle] = useState(existingNote?.title || '');
  const [items, setItems] = useState<ListItem[]>(
    existingNote?.items || [{ id: Date.now().toString(), text: '' }]
  );

  const handleBackPress = () => {
    const newNote: ListNote = {
      id: existingNote?.id || Date.now().toString(),
      type: 'list',
      title: title.trim(),
      items: items.filter((item) => item.text.trim()),
      timestamp: new Date().toLocaleString(),
    };

    if (newNote.title || newNote.items.length > 0) {
      setNotes((prev) => {
        const existingIndex = prev.findIndex((n) => n.id === newNote.id);
        if (existingIndex >= 0) {
          const newNotes = [...prev];
          newNotes[existingIndex] = newNote;
          return newNotes;
        }
        return [...prev, newNote];
      });
    } else if (existingNote) {
      setNotes((prev) => prev.filter((n) => n.id !== existingNote.id));
    }
    navigation.goBack();
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#5f6368" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, title, items]);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), text: '' }]);
  };

  const updateItem = (id: string, text: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, text } : item)));
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
          <Icon name="arrow-back" size={24} color="#5f6368" />
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon}>
            <Icon name="push-pin" size={20} color="#5f6368" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Icon name="notifications" size={24} color="#5f6368" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="archive" size={24} color="#5f6368" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.titleRow}>
          <TextInput
            style={styles.titleInput}
            placeholder="Title"
            placeholderTextColor="#e0e0e0"
            value={title}
            onChangeText={setTitle}
          />
          <TouchableOpacity>
            <Icon name="more-vert" size={24} color="#5f6368" />
          </TouchableOpacity>
        </View>

        {items.map((item) => (
          <View key={item.id} style={styles.listItem}>
            <TouchableOpacity>
              <Icon name="drag-indicator" size={20} color="#bdbdbd" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon name="check-box-outline-blank" size={24} color="#bdbdbd" />
            </TouchableOpacity>
            <TextInput
              style={styles.itemInput}
              placeholder="List item"
              placeholderTextColor="#9e9e9e"
              value={item.text}
              onChangeText={(text) => updateItem(item.id, text)}
            />
            <TouchableOpacity onPress={() => removeItem(item.id)}>
              <Icon name="close" size={20} color="#9e9e9e" />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={addItem}>
          <Icon name="add" size={20} color="#5f6368" />
          <Text style={styles.addButtonText}>List item</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.toolbar}>
        <View style={styles.toolbarLeft}>
          <TouchableOpacity style={styles.toolbarButton}>
            <Icon name="add-box" size={24} color="#5f6368" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton}>
            <Icon name="brush" size={20} color="#5f6368" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton}>
            <Icon name="format-size" size={20} color="#5f6368" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Icon name="more-vert" size={24} color="#5f6368" />
        </TouchableOpacity>
      </View>

      <Text style={styles.timestamp}>Edited just now</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f3f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    paddingRight: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  headerIcon: {
    marginRight: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  titleInput: {
    flex: 1,
    fontSize: 22,
    fontWeight: '500',
    color: '#212121',
    marginRight: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  itemInput: {
    flex: 1,
    marginHorizontal: 12,
    fontSize: 16,
    color: '#212121',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginTop: 8,
  },
  addButtonText: {
    marginLeft: 8,
    color: '#5f6368',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  toolbarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolbarButton: {
    marginRight: 24,
  },
  timestamp: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    color: '#9e9e9e',
    fontSize: 12,
  },
});

export default ListScreen;