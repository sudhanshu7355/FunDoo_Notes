
import React, { useState, useEffect, useContext } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Text, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { NotesContext, Note } from '../context/NotesContext';

type ImageNote = Note & {
  type: 'image';
  imageUri: string;
};

const ImageScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { setNotes } = useContext(NotesContext);
  const existingNote = route.params?.note as ImageNote | undefined;

  const [imageUri, setImageUri] = useState(existingNote?.imageUri || '');

  const handleBackPress = () => {
    const imageNote: ImageNote = {
      id: existingNote?.id || Date.now().toString(),
      type: 'image',
      imageUri: imageUri,
      timestamp: new Date().toLocaleString(),
    };

    if (imageUri) {
      setNotes((prev) => {
        const existingIndex = prev.findIndex((n) => n.id === imageNote.id);
        if (existingIndex >= 0) {
          const newNotes = [...prev];
          newNotes[existingIndex] = imageNote;
          return newNotes;
        }
        return [...prev, imageNote];
      });
    } else if (existingNote) {
      setNotes((prev) => prev.filter((n) => n.id !== existingNote.id));
    }
    navigation.goBack();
  };

  const handleTakePhoto = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
      });

      if (!result.didCancel && result.assets?.[0]?.uri) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handleChooseImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
      });

      if (!result.didCancel && result.assets?.[0]?.uri) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to choose image');
    }
  };

  
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Icon name="arrow-back" size={24} color="#5F6368" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, imageUri]);

  return (
    <View style={styles.container}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
      ) : (
        <View style={styles.placeholderContainer}>
          <Icon name="image" size={64} color="#E0E0E0" />
          <Text style={styles.placeholderText}>No image selected</Text>
        </View>
      )}

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.actionButton} onPress={handleTakePhoto}>
          <Icon name="photo-camera" size={32} color="#5F6368" />
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleChooseImage}>
          <Icon name="image" size={32} color="#5F6368" />
          <Text style={styles.buttonText}>Choose Image</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 16,
  },
  imagePreview: {
    flex: 1,
    borderRadius: 8,
    marginBottom: 16,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 16,
  },
  placeholderText: {
    color: '#9AA0A6',
    fontSize: 18,
    marginTop: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  actionButton: {
    alignItems: 'center',
    padding: 16,
  },
  buttonText: {
    color: '#5F6368',
    marginTop: 8,
  },
  backButton: {
    marginLeft: 16,
    padding: 8,
  },
});

export default ImageScreen;