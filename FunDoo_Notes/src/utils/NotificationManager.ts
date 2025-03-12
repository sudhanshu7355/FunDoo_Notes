
import notifee, {
    AndroidImportance,
    TriggerType,
    Trigger,
    EventType,
    TimestampTrigger,
  } from '@notifee/react-native';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { Note } from '../context/NotesContext'; 
  
  class NotificationManager {
    private channelId = 'reminder-channel';
  
    constructor() {
      this.initialize();
    }
  
    private async initialize() {
      
      const channelId = await notifee.createChannel({
        id: this.channelId,
        name: 'Reminder Channel',
        importance: AndroidImportance.HIGH,
      });
      console.log('Notification channel created:', channelId);
  
      
      this.setupEventListeners();
    }
  
    private setupEventListeners() {
      notifee.onForegroundEvent(({ type, detail }) => {
        if (type === EventType.PRESS) {
          console.log('Notification pressed:', detail.notification);
          
        }
      });
  
      notifee.onBackgroundEvent(async ({ type, detail }) => {
        if (type === EventType.PRESS) {
          console.log('Background notification pressed:', detail.notification);
        }
      });
    }
  
    async scheduleReminder(note: Note) {
      if (!note.reminder) return;
  
      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: note.reminder.getTime(), 
        alarmManager: true, 
      };
  
      const notificationId = await notifee.createTriggerNotification(
        {
          title: 'Reminder',
          body: `Time for your note: ${note.title || 'Untitled'}`,
          data: { noteId: note.id }, // Pass note ID for navigation or further action
          android: {
            channelId: this.channelId,
            pressAction: {
              id: 'default',
            },
          },
        },
        trigger
      );
  
      
      const storedNotes = await AsyncStorage.getItem('notes');
      const notes = storedNotes ? JSON.parse(storedNotes) : [];
      const updatedNotes = notes.map((n: Note) =>
        n.id === note.id ? { ...n, notificationId } : n
      );
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      console.log('Reminder scheduled with ID:', notificationId);
    }
  
    async cancelReminder(note: Note) {
      if (note.notificationId) {
        await notifee.cancelNotification(note.notificationId);
        console.log('Reminder cancelled for note ID:', note.id);
  
      
        const storedNotes = await AsyncStorage.getItem('notes');
        if (storedNotes) {
          const notes = JSON.parse(storedNotes);
          const updatedNotes = notes.map((n: Note) =>
            n.id === note.id ? { ...n, notificationId: null } : n
          );
          await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
        }
      }
    }
  
    
    static instance: NotificationManager;
  
    static getInstance() {
      if (!NotificationManager.instance) {
        NotificationManager.instance = new NotificationManager();
      }
      return NotificationManager.instance;
    }
  }
  
  export default NotificationManager.getInstance();