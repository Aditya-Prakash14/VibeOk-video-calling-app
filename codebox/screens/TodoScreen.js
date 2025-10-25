import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Text,
  TextInput,
  Button,
  Card,
  Checkbox,
  IconButton,
  FAB,
  Portal,
  Modal,
  useTheme,
  Chip,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';

export default function TodoScreen() {
  const { user } = useAuth();
  const theme = useTheme();
  const [todos, setTodos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const todosData = await AsyncStorage.getItem(`todos_${user.id}`);
      if (todosData) {
        setTodos(JSON.parse(todosData));
      }
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  };

  const saveTodos = async (updatedTodos) => {
    try {
      await AsyncStorage.setItem(`todos_${user.id}`, JSON.stringify(updatedTodos));
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  };

  const addTodo = () => {
    if (!newTodoTitle.trim()) return;

    const newTodo = {
      id: Date.now().toString(),
      title: newTodoTitle,
      description: newTodoDescription,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    saveTodos([newTodo, ...todos]);
    setNewTodoTitle('');
    setNewTodoDescription('');
    setModalVisible(false);
  };

  const toggleTodo = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos(updatedTodos);
  };

  const deleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    saveTodos(updatedTodos);
  };

  const incompleteTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  const renderTodoItem = ({ item }) => (
    <Card style={[styles.todoCard, item.completed && styles.completedCard]}>
      <Card.Content style={styles.todoContent}>
        <View style={styles.todoLeft}>
          <Checkbox
            status={item.completed ? 'checked' : 'unchecked'}
            onPress={() => toggleTodo(item.id)}
          />
          <View style={styles.todoText}>
            <Text
              variant="titleMedium"
              style={[styles.todoTitle, item.completed && styles.completedText]}
            >
              {item.title}
            </Text>
            {item.description ? (
              <Text
                variant="bodySmall"
                style={[styles.todoDescription, item.completed && styles.completedText]}
              >
                {item.description}
              </Text>
            ) : null}
          </View>
        </View>
        <IconButton
          icon="delete"
          size={20}
          onPress={() => deleteTodo(item.id)}
          iconColor={theme.colors.error}
        />
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.headerTitle}>
            Daily Tasks
          </Text>
          <View style={styles.stats}>
            <Chip icon="check-circle" style={styles.chip}>
              {completedTodos.length} done
            </Chip>
            <Chip icon="clock-outline" style={styles.chip}>
              {incompleteTodos.length} pending
            </Chip>
          </View>
        </View>

        {/* Todo List */}
        <FlatList
          data={todos}
          renderItem={renderTodoItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text variant="titleMedium" style={styles.emptyTitle}>
                No tasks yet
              </Text>
              <Text variant="bodyMedium" style={styles.emptyText}>
                Tap the + button to add your first task
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />

        {/* Add Todo FAB */}
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        />

        {/* Add Todo Modal */}
        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
            contentContainerStyle={styles.modalContent}
          >
            <Text variant="headlineSmall" style={styles.modalTitle}>
              Add New Task
            </Text>
            <TextInput
              label="Task Title"
              value={newTodoTitle}
              onChangeText={setNewTodoTitle}
              mode="outlined"
              style={styles.input}
              autoFocus
            />
            <TextInput
              label="Description (Optional)"
              value={newTodoDescription}
              onChangeText={setNewTodoDescription}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
            />
            <View style={styles.modalButtons}>
              <Button
                mode="outlined"
                onPress={() => setModalVisible(false)}
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={addTodo}
                style={styles.modalButton}
              >
                Add
              </Button>
            </View>
          </Modal>
        </Portal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  stats: {
    flexDirection: 'row',
    gap: 10,
  },
  chip: {
    backgroundColor: '#f0f0f0',
  },
  list: {
    padding: 15,
    paddingBottom: 100,
  },
  todoCard: {
    marginBottom: 10,
    elevation: 1,
  },
  completedCard: {
    opacity: 0.6,
  },
  todoContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 0,
  },
  todoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  todoText: {
    flex: 1,
    marginLeft: 10,
  },
  todoTitle: {
    fontWeight: '500',
  },
  todoDescription: {
    color: '#666',
    marginTop: 2,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptyText: {
    color: '#666',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  modalTitle: {
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalButton: {
    flex: 1,
  },
});
