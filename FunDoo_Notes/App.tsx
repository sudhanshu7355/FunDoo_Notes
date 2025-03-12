// App.tsx
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Text } from 'react-native'; // Keep this for potential future use
import CustomDrawer from './src/components/CustomDrawer/CustomDrawer';
import NotesScreen from './src/screen/NotesScreen';
import TextEditorScreen from './src/screen/TextEditorScreen';
import ListScreen from './src/screen/ListScreen';
import DrawingScreen from './src/screen/DrawingScreen';
import ImageScreen from './src/screen/ImageScreen';
import SettingsScreen from './src/screen/SettingsScreen';
import { NotesProvider } from './src/context/NotesContext';
import ArchiveScreen from './src/screen/ArchiveScreen';
import TrashScreen from './src/screen/TrashScreen';
import HelpScreen from './src/screen/HelpScreen';
import LabelsScreen from './src/screen/LabelsScreen';
import LoginScreen from './src/screen/LoginScreen';
import SignupScreen from './src/screen/SignupScreen'; // Import SignupScreen

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function MainStack() {
  return (
    <Stack.Navigator
      initialRouteName="Login" // Explicitly set Login as the initial route
      screenOptions={{
        headerShown: true, // Enable header for all screens in the stack
        headerStyle: { backgroundColor: '#E0F2F1' }, // Match drawer style
        headerTintColor: '#5F6368', // Match icon color
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notes"
        component={NotesScreen}
        options={{ headerTitle: 'Notes', headerShown: false }}
      />
      <Stack.Screen
        name="TextEditor"
        component={TextEditorScreen}
        options={{ headerTitle: 'Text Editor' }}
      />
      <Stack.Screen
        name="List"
        component={ListScreen}
        options={{ headerTitle: 'List' }}
      />
      <Stack.Screen
        name="Drawing"
        component={DrawingScreen}
        options={{ headerTitle: 'Drawing' }}
      />
      <Stack.Screen
        name="Image"
        component={ImageScreen}
        options={{ headerTitle: 'Image Note' }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerTitle: 'Settings' }}
      />
      <Stack.Screen
        name="Archive"
        component={ArchiveScreen}
        options={{ headerTitle: 'Archive' }}
      />
      <Stack.Screen
        name="Trash"
        component={TrashScreen}
        options={{ headerTitle: 'Trash' }}
      />
      <Stack.Screen
        name="Help"
        component={HelpScreen}
        options={{ headerTitle: 'Help' }}
      />
      <Stack.Screen
        name="Labels"
        component={LabelsScreen}
        options={{ headerTitle: 'Labels' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NotesProvider>
        <NavigationContainer>
          <Drawer.Navigator
            initialRouteName="MainStack" // Explicitly set MainStack as the initial route
            drawerContent={(props) => <CustomDrawer {...props} />}
            screenOptions={{
              drawerStyle: {
                backgroundColor: '#E0F2F1',
                width: 280,
              },
              headerShown: false,
              swipeEdgeWidth: 60,
              overlayColor: 'rgba(0,0,0,0.25)',
            }}
          >
            <Drawer.Screen name="MainStack" component={MainStack} />
            <Drawer.Screen name="Settings" component={SettingsScreen} />
          </Drawer.Navigator>
        </NavigationContainer>
      </NotesProvider>
    </GestureHandlerRootView>
  );
}