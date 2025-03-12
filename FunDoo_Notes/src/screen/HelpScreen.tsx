
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const HelpScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const popularHelpItems = [
    {
      title: 'Change list, remind & sharing settings',
      onPress: () => Linking.openURL('https://support.google.com/keep'), 
    },
    {
      title: 'Archive notes and lists',
      onPress: () => Linking.openURL('https://support.google.com/keep'), 
    },
    {
      title: 'Get notes on your Android home screen',
      onPress: () => Linking.openURL('https://support.google.com/keep'), 
    },
    {
      title: 'Export your data from Google Keep',
      onPress: () => Linking.openURL('https://support.google.com/keep'), 
    },
    {
      title: 'Use Keep to protect your privacy and stay in control',
      onPress: () => Linking.openURL('https://support.google.com/keep'), 
    },
  ];

  const handlePostToCommunity = () => {
    Linking.openURL('https://support.google.com/keep/community'); 
  };

  const handleSendFeedback = () => {
    Linking.openURL('mailto:support@example.com?subject=Feedback'); 
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#5F6368" />
        </TouchableOpacity>
        <Text style={styles.title}>Help</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Icon name="more-vert" size={24} color="#5F6368" />
        </TouchableOpacity>
      </View>

      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular help resources</Text>
        {popularHelpItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.helpItem}
            onPress={item.onPress}
          >
            <Icon name="description" size={24} color="#1A73E8" style={styles.helpIcon} />
            <Text style={styles.helpTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      
      <View style={styles.section}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={24} color="#5F6368" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search help"
            placeholderTextColor="#9AA0A6"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Need more help?</Text>
        <TouchableOpacity style={styles.helpItem} onPress={handlePostToCommunity}>
          <Icon name="forum" size={24} color="#1A73E8" style={styles.helpIcon} />
          <View style={styles.helpTextContainer}>
            <Text style={styles.helpTitle}>Post to the Help Community</Text>
            <Text style={styles.helpDescription}>Get answers from community members</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.helpItem} onPress={handleSendFeedback}>
          <Icon name="feedback" size={24} color="#1A73E8" style={styles.helpIcon} />
          <Text style={styles.helpTitle}>Send Feedback</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  menuButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#202124',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#202124',
    marginBottom: 12,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  helpIcon: {
    marginRight: 12,
  },
  helpTextContainer: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    color: '#202124',
  },
  helpDescription: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F3F4',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#202124',
  },
});

export default HelpScreen;