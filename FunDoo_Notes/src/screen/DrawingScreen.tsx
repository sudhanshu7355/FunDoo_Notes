
import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, PanResponder, StyleSheet, TouchableOpacity, ScrollView, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NotesContext, Note } from '../context/NotesContext';

type DrawingNote = Note & {
  type: 'drawing';
  drawing: Array<{
    points: Array<{ x: number; y: number }>;
    color: string;
    width: number;
  }>;
};

const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#FF9F1C', '#2EC4B6', '#E71D36', '#011627'];
const tools = ['pen', 'brush', 'eraser'];
const MIN_SIZE = 1;
const MAX_SIZE = 20;

const DrawingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { setNotes } = useContext(NotesContext);
  const existingNote = route.params?.note as DrawingNote | undefined;

  const [paths, setPaths] = useState(existingNote?.drawing || []);
  const [history, setHistory] = useState<typeof paths[]>([]);
  const [redoStack, setRedoStack] = useState<typeof paths[]>([]);
  const [currentColor, setCurrentColor] = useState('#FF6B6B');
  const [currentTool, setCurrentTool] = useState('pen');
  const [toolSizes, setToolSizes] = useState({
    pen: 3,
    brush: 8,
    eraser: 12,
  });
  const currentPath = useRef<Array<{ x: number; y: number }>>([]);
  const currentWidth = toolSizes[currentTool as keyof typeof toolSizes];

  const saveState = (newPaths: typeof paths) => {
    setHistory((prev) => [...prev, paths]);
    setPaths(newPaths);
    setRedoStack([]);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (_, gesture) => {
      currentPath.current = [{ x: gesture.x0, y: gesture.y0 }];
    },
    onPanResponderMove: (_, gesture) => {
      currentPath.current = [...currentPath.current, { x: gesture.moveX, y: gesture.moveY }];
      setPaths([...paths]);
    },
    onPanResponderRelease: () => {
      const newPath = {
        points: [...currentPath.current],
        color: currentTool === 'eraser' ? '#FFFFFF' : currentColor,
        width: currentWidth,
      };
      saveState([...paths, newPath]);
      currentPath.current = [];
    },
  });

  const handleBackPress = () => {
    const drawingNote: DrawingNote = {
      id: existingNote?.id || Date.now().toString(),
      type: 'drawing',
      drawing: paths,
      timestamp: new Date().toLocaleString(),
    };

    if (paths.length > 0) {
      setNotes((prev) => {
        const existingIndex = prev.findIndex((n) => n.id === drawingNote.id);
        if (existingIndex >= 0) {
          const newNotes = [...prev];
          newNotes[existingIndex] = drawingNote;
          return newNotes;
        }
        return [...prev, drawingNote];
      });
    } else if (existingNote) {
      setNotes((prev) => prev.filter((n) => n.id !== existingNote.id));
    }
    navigation.goBack();
  };

  
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Icon name="arrow-back" size={24} color="#5F6368" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, paths]);

  const handleUndo = () => {
    if (paths.length > 0) {
      setRedoStack((prev) => [...prev, paths]);
      const newPaths = paths.slice(0, -1);
      setHistory((prev) => prev.slice(0, -1));
      setPaths(newPaths);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const lastState = redoStack[redoStack.length - 1];
      setRedoStack((prev) => prev.slice(0, -1));
      setHistory((prev) => [...prev, paths]);
      setPaths(lastState);
    }
  };

  const handleClear = () => {
    saveState([]);
  };

  const handleSizeChange = (operation: 'increase' | 'decrease') => {
    setToolSizes((prev) => ({
      ...prev,
      [currentTool]: Math.max(MIN_SIZE, Math.min(MAX_SIZE, prev[currentTool as keyof typeof prev] + (operation === 'increase' ? 1 : -1))),
    }));
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.canvasContainer} {...panResponder.panHandlers}>
        <Svg style={styles.canvas}>
          {paths.map((path, index) => (
            <Path
              key={index}
              d={path.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
              stroke={path.color}
              fill="none"
              strokeWidth={path.width}
              strokeLinecap="round"
            />
          ))}
          {currentPath.current.length > 0 && (
            <Path
              d={currentPath.current.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
              stroke={currentTool === 'eraser' ? '#FFFFFF' : currentColor}
              fill="none"
              strokeWidth={currentWidth}
              strokeLinecap="round"
            />
          )}
        </Svg>
      </View>

      
      <View style={styles.controls}>
       
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={[styles.actionButton, paths.length === 0 && styles.disabledButton]}
            onPress={handleUndo}
            disabled={paths.length === 0}
          >
            <Icon name="undo" size={24} color={paths.length === 0 ? '#CCC' : '#666'} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, redoStack.length === 0 && styles.disabledButton]}
            onPress={handleRedo}
            disabled={redoStack.length === 0}
          >
            <Icon name="redo" size={24} color={redoStack.length === 0 ? '#CCC' : '#666'} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, paths.length === 0 && styles.disabledButton]}
            onPress={handleClear}
            disabled={paths.length === 0}
          >
            <Icon name="delete" size={24} color={paths.length === 0 ? '#CCC' : '#666'} />
          </TouchableOpacity>
        </View>

       
        <View style={styles.sizeControls}>
          <TouchableOpacity style={styles.sizeButton} onPress={() => handleSizeChange('decrease')}>
            <Text style={styles.sizeText}>-</Text>
          </TouchableOpacity>

          <View style={styles.sizeDisplay}>
            <Text style={styles.sizeText}>{currentWidth}px</Text>
          </View>

          <TouchableOpacity style={styles.sizeButton} onPress={() => handleSizeChange('increase')}>
            <Text style={styles.sizeText}>+</Text>
          </TouchableOpacity>
        </View>

        
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.toolGroup}>
            {tools.map((tool) => (
              <TouchableOpacity
                key={tool}
                style={[styles.toolButton, currentTool === tool && styles.activeTool]}
                onPress={() => setCurrentTool(tool)}
              >
                <Icon
                  name={tool === 'pen' ? 'edit' : tool === 'brush' ? 'brush' : 'delete'}
                  size={24}
                  color={currentTool === tool ? currentColor : '#666'}
                />
              </TouchableOpacity>
            ))}

            <View style={styles.colorPicker}>
              {colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: color },
                    currentColor === color && styles.selectedColor,
                  ]}
                  onPress={() => setCurrentColor(color)}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: 'white',
    elevation: 3,
    margin: 16,
    borderRadius: 8,
  },
  canvas: {
    flex: 1,
  },
  controls: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 16,
    marginBottom: 16,
  },
  actionButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F1F3F5',
  },
  disabledButton: {
    opacity: 0.5,
  },
  sizeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sizeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F1F3F5',
    width: 40,
    alignItems: 'center',
  },
  sizeDisplay: {
    backgroundColor: '#F1F3F5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  sizeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  toolGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  toolButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F1F3F5',
  },
  activeTool: {
    backgroundColor: '#E9ECEF',
  },
  colorPicker: {
    flexDirection: 'row',
    gap: 12,
    marginLeft: 16,
  },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'white',
  },
  selectedColor: {
    transform: [{ scale: 1.1 }],
    borderColor: '#666',
  },
  backButton: {
    marginLeft: 16,
    padding: 8,
  },
});

export default DrawingScreen;