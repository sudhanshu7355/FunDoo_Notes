import React, { useState, useEffect, useContext } from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native'; // Added useFocusEffect
import { DrawerActions } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import FabGroup from '../components/FabGroup/FabGroup';
import Snackbar from 'react-native-snackbar';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NotesContext, Note } from '../context/NotesContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationManager from '../utils/NotificationManager';

const NotesScreen = () => {
  const { notes, setNotes } = useContext(NotesContext);
  const navigation = useNavigation();
  const route = useRoute();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGridView, setIsGridView] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'date' | 'time'>('date');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePickerFor, setShowDatePickerFor] = useState<string | null>(null);

  const filterByLabel = route.params?.filterByLabel as string | undefined;

  const availableColors = ['#fff9e6', '#e6ffe6', '#e6f3ff', '#ffe6e6'];

  useEffect(() => {
    loadNotes();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadNotes();
    }, [])
  );

  const loadNotes = async () => {
    try {
      setIsLoading(true);
      const storedNotes = await AsyncStorage.getItem('notes');
      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);
        setNotes(parsedNotes);

        // Reschedule any existing reminders
        parsedNotes.forEach((note: Note) => {
          if (note.reminder && !note.notificationId) {
            NotificationManager.scheduleReminder(note);
          }
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load notes', error);
      setIsLoading(false);
    }
  };

  const handlePinNote = (noteId: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, pinned: !n.pinned } : n))
    );
  };

  const handleSetColor = (noteId: string) => {
    setNotes((prev) => {
      const noteIndex = prev.findIndex((n) => n.id === noteId);
      if (noteIndex === -1) return prev;
      const currentColor = prev[noteIndex].color || availableColors[0];
      const currentIndex = availableColors.indexOf(currentColor);
      const nextIndex = (currentIndex + 1) % availableColors.length;
      const newColor = availableColors[nextIndex];
      return prev.map((n, i) => (i === noteIndex ? { ...n, color: newColor } : n));
    });
  };

  const showDateTimePickerForNote = (noteId: string) => {
    setShowDatePickerFor(noteId);
    setShowDatePicker(true);
    setDatePickerMode('date');
    setSelectedDate(new Date());
  };

  const onDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (event.type === 'set' && date && showDatePickerFor) {
      setSelectedDate(date);
      if (datePickerMode === 'date') {
        setDatePickerMode('time');
        if (Platform.OS === 'android') {
          setTimeout(() => setShowDatePicker(true), 100);
        }
      } else {
        handleSetReminder(showDatePickerFor, date);
        setShowDatePicker(false);
        setShowDatePickerFor(null);
      }
    } else {
      setShowDatePicker(false);
      setShowDatePickerFor(null);
    }
  };

  const handleSetReminder = async (noteId: string, date: Date) => {
    if (date < new Date()) {
      Snackbar.show({
        text: 'Please select a future date',
        duration: Snackbar.LENGTH_SHORT,
      });
      return;
    }
    const updatedNotes = notes.map((n) =>
      n.id === noteId ? { ...n, reminder: date } : n
    );
    setNotes(updatedNotes);
    await saveNotes(updatedNotes);

    // Schedule the reminder notification
    const noteToUpdate = updatedNotes.find((n) => n.id === noteId);
    if (noteToUpdate) {
      await NotificationManager.scheduleReminder(noteToUpdate);
    }

    Snackbar.show({
      text: 'Reminder set!',
      duration: Snackbar.LENGTH_SHORT,
    });
  };

  const handleMoveToTrash = (noteId: string) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === noteId ? { ...note, trashed: true } : note))
    );
    const noteToTrash = notes.find((n) => n.id === noteId);
    if (noteToTrash && noteToTrash.reminder) {
      NotificationManager.cancelReminder(noteToTrash);
    }
    Snackbar.show({
      text: 'Note moved to Trash',
      duration: Snackbar.LENGTH_SHORT,
      action: {
        text: 'Undo',
        textColor: '#4CAF50',
        onPress: () => {
          setNotes((prev) =>
            prev.map((note) => (note.id === noteId ? { ...note, trashed: false } : note))
          );
        },
      },
    });
  };

  const handleArchiveNote = (noteId: string) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === noteId ? { ...note, archived: true } : note))
    );
    const noteToArchive = notes.find((n) => n.id === noteId);
    if (noteToArchive && noteToArchive.reminder) {
      NotificationManager.cancelReminder(noteToArchive);
    }
  };

  const saveNotes = async (updatedNotes: Note[]) => {
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    } catch (error) {
      console.error('Failed to save notes', error);
    }
  };

  const filteredNotes = notes.filter((note) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !note.archived &&
      !note.trashed &&
      (note.title?.toLowerCase().includes(query) ||
        note.content?.toLowerCase().includes(query) ||
        note.items?.some((item) => item.text.toLowerCase().includes(query)) ||
        (note.type === 'image' && 'image'.includes(query)) ||
        (note.type === 'drawing' &&
          note.drawing?.some((path) => path.color.toLowerCase().includes(query))));

    const matchesLabel = !filterByLabel || (note.labels && note.labels.includes(filterByLabel));

    return matchesSearch && matchesLabel;
  });

  const renderNoteItem = ({ item }: { item: Note }) => (
    <TouchableOpacity
      style={[
        styles.noteContainer,
        isGridView ? styles.gridItem : styles.listItem,
        { backgroundColor: item.color || '#fff9e6' },
      ]}
      onPress={() =>
        navigation.navigate(
          item.type === 'drawing'
            ? 'Drawing'
            : item.type === 'list'
            ? 'List'
            : item.type === 'image'
            ? 'Image'
            : 'TextEditor',
          { note: item }
        )
      }
    >
      {item.pinned && <Icon name="push-pin" size={16} color="#666" style={styles.pinIcon} />}
      {item.type === 'drawing' ? (
        <View style={styles.drawingPreview}>
          <Svg width="100%" height="100%">
            {item.drawing?.map((path, index) => (
              <Path
                key={index}
                d={path.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
                stroke={path.color}
                fill="none"
                strokeWidth={path.width}
                strokeLinecap="round"
              />
            ))}
          </Svg>
        </View>
      ) : item.type === 'list' ? (
        <>
          <Text style={styles.noteTitle}>{item.title || 'Untitled List'}</Text>
          {item.items?.map((listItem, index) => (
            <Text key={index} style={styles.noteContent}>
              • {listItem.text}
            </Text>
          ))}
        </>
      ) : item.type === 'image' ? (
        <Image
          source={{ uri: item.imageUri }}
          style={[styles.imagePreview, !isGridView && styles.listImage]}
        />
      ) : (
        <>
          <Text style={styles.noteTitle}>{item.title || 'Untitled Note'}</Text>
          <Text
            style={[styles.noteContent, !isGridView && styles.listContentText]}
            numberOfLines={isGridView ? 2 : undefined}
          >
            {item.content}
          </Text>
        </>
      )}
      <View style={styles.footerContainer}>
        <Text style={styles.noteTimestamp}>{item.timestamp}</Text>
        {item.reminder && (
          <Text style={styles.reminderText}>{new Date(item.reminder).toLocaleString()}</Text>
        )}
      </View>
      <View style={styles.actionIcons}>
        <TouchableOpacity onPress={() => handlePinNote(item.id)}>
          <Icon name={item.pinned ? 'push-pin' : 'push-pin'} size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSetColor(item.id)}>
          <Icon name="palette" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => showDateTimePickerForNote(item.id)}>
          <Icon name="alarm" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleArchiveNote(item.id)}>
          <Icon name="archive" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleMoveToTrash(item.id)}>
          <Icon name="delete" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Icon name="menu" size={24} color="black" />
        </TouchableOpacity>
        <TextInput
          placeholder="Search your notes"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={() => setIsGridView(!isGridView)}>
            <Icon name={isGridView ? 'view-agenda' : 'dashboard'} size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="account-circle" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        key={isGridView ? 'grid-view' : 'list-view'}
        data={filteredNotes}
        renderItem={renderNoteItem}
        keyExtractor={(item) => item.id}
        numColumns={isGridView ? 2 : 1}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4CAF50" />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="note" size={64} color="#e0e0e0" />
              <Text style={styles.emptyText}>No notes found</Text>
            </View>
          )
        }
      />

      <FabGroup
        onImagePress={() => navigation.navigate('Image')}
        onDrawingPress={() => navigation.navigate('Drawing')}
        onListPress={() => navigation.navigate('List')}
        onTextPress={() => navigation.navigate('TextEditor')}
      />

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={selectedDate}
          mode={datePickerMode}
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebfbfc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  iconButton: {
    padding: 8,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  noteContainer: {
    margin: 8,
    padding: 16,
    borderRadius: 8,
    minHeight: 120,
  },
  gridItem: {
    width: '48%',
    marginHorizontal: '1%',
  },
  listItem: {
    width: '100%',
    marginHorizontal: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noteContent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  listContentText: {
    flex: 1,
    marginLeft: 8,
  },
  noteTimestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 'auto',
  },
  reminderText: {
    fontSize: 12,
    color: '#4CAF50',
  },
  listContent: {
    padding: 8,
  },
  drawingPreview: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    aspectRatio: 1,
  },
  imagePreview: {
    borderRadius: 8,
    aspectRatio: 1,
    marginBottom: 8,
  },
  listImage: {
    width: 100,
    height: 100,
    marginRight: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#9e9e9e',
    marginTop: 16,
  },
  footerContainer: {
    marginTop: 'auto',
    paddingTop: 8,
  },
  pinIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  actionIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
});

export default NotesScreen;