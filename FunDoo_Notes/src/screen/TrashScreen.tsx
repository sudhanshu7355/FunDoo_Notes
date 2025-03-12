
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { NotesContext, Note } from '../context/NotesContext';

const TrashScreen = () => {
  const navigation = useNavigation();
  const { notes, setNotes } = useContext(NotesContext);
  
  const trashedNotes = notes.filter(note => note.trashed);

  const handleRestore = (noteId: string) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, trashed: false } : note
    ));
  };

  const handlePermanentDelete = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };

  const renderTrashedNote = ({ item }: { item: Note }) => (
    <View style={styles.noteContainer}>
      <Text style={styles.noteTitle}>{item.title || 'Untitled'}</Text>
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleRestore(item.id)}
        >
          <Icon name="restore" size={24} color="#5F6368" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handlePermanentDelete(item.id)}
        >
          <Icon name="delete-forever" size={24} color="#5F6368" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#5F6368" />
        </TouchableOpacity>
        <Text style={styles.title}>Trash</Text>
      </View>
      
      <FlatList
        data={trashedNotes}
        renderItem={renderTrashedNote}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="delete" size={64} color="#E0E0E0" />
            <Text style={styles.emptyText}>Trash is empty</Text>
          </View>
        }
      />
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
    marginLeft: 16,
  },
  noteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  noteTitle: {
    fontSize: 16,
    color: '#202124',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#9E9E9E',
    marginTop: 16,
  },
});

export default TrashScreen;