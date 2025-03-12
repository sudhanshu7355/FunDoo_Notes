
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { NotesContext, Note } from '../context/NotesContext';

const ArchiveScreen = () => {
  const navigation = useNavigation();
  const { notes, setNotes } = useContext(NotesContext);
  
  
  const archivedNotes = notes.filter(note => note.archived);

  const handleUnarchive = (noteId: string) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, archived: false } : note
    ));
  };

  const renderArchivedNote = ({ item }: { item: Note }) => (
    <View style={styles.noteContainer}>
      <Text style={styles.noteTitle}>{item.title || 'Untitled'}</Text>
      <TouchableOpacity 
        style={styles.unarchiveButton}
        onPress={() => handleUnarchive(item.id)}
      >
        <Icon name="unarchive" size={24} color="#5F6368" />
      </TouchableOpacity>
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
        <Text style={styles.title}>Archive</Text>
      </View>
      
      <FlatList
        data={archivedNotes}
        renderItem={renderArchivedNote}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="archive" size={64} color="#E0E0E0" />
            <Text style={styles.emptyText}>No archived notes</Text>
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
  },
  unarchiveButton: {
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

export default ArchiveScreen;