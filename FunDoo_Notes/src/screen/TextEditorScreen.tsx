
import React, { useState, useEffect, useContext } from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NotesContext, Note } from '../context/NotesContext';

export default function TextEditorScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { setNotes } = useContext(NotesContext);
  const existingNote = route.params?.note as Note | undefined;

  const [title, setTitle] = useState(existingNote?.title || '');
  const [content, setContent] = useState(existingNote?.content || '');
  const [timestamp, setTimestamp] = useState(existingNote?.timestamp || '');

  const handleSave = () => {
    const newNote: Note = {
      id: existingNote?.id || Date.now().toString(),
      type: 'text',
      title: title.trim(),
      content: content.trim(),
      timestamp: new Date().toLocaleString(),
    };

    if (newNote.title || newNote.content) {
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleSave}>
          <Icon name="arrow-back" size={24} color="#5f6368" />
        </TouchableOpacity>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="push-pin" size={24} color="#5f6368" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="notifications" size={24} color="#5f6368" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="archive" size={24} color="#5f6368" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <TextInput
          style={styles.titleInput}
          placeholder="Title"
          placeholderTextColor="#80868b"
          value={title}
          onChangeText={setTitle}
          multiline
        />
        <TextInput
          style={styles.contentInput}
          placeholder="Note"
          placeholderTextColor="#9aa0a6"
          value={content}
          onChangeText={setContent}
          multiline
          scrollEnabled={false}
        />
      </ScrollView>

      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.toolbarButton}>
          <Icon name="attach-file" size={24} color="#5f6368" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolbarButton}>
          <Icon name="palette" size={24} color="#5f6368" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolbarButton}>
          <Icon name="format-bold" size={24} color="#5f6368" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolbarButton}>
          <Icon name="more-vert" size={24} color="#5f6368" />
        </TouchableOpacity>
      </View>

      <Text style={styles.timestamp}>{timestamp || 'Just now'}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff9e6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    padding: 8,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 16,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '500',
    color: '#202124',
    marginBottom: 16,
    minHeight: 40,
  },
  contentInput: {
    fontSize: 16,
    color: '#202124',
    lineHeight: 24,
    minHeight: 100,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  toolbarButton: {
    padding: 8,
  },
  timestamp: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    fontSize: 12,
    color: '#9aa0a6',
  },
});