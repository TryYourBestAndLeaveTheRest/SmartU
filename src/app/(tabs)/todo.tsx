import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Spacing } from '@/constants/theme';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/Card';
import { CustomInput } from '@/components/ui/CustomInput';
import { CustomButton } from '@/components/ui/CustomButton';
import * as db from '@/utils/database';
import { Modal } from 'react-native';



/*
const STORAGE_KEY = '@smartu_todos';
*/

export default function TodoScreen() {
  const [todos, setTodos] = useState<db.Todo[]>([]);
  const [inputText, setInputText] = useState('');
  const [editingTodo, setEditingTodo] = useState<db.Todo | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      /*
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) setTodos(JSON.parse(stored));
      */
      const data = await db.getTodos();
      setTodos(data);
    } catch (e) {
      console.error('Failed to load todos', e);
    }
  };

  /*
  const saveTodos = async (newTodos: Todo[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos));
    } catch (e) {
      console.error('Failed to save todos', e);
    }
  };
  */

  const addTodo = async () => {
    if (inputText.trim().length === 0) return;
    try {
      /*
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: inputText.trim(),
        completed: false,
      };
      const updated = [newTodo, ...todos];
      setTodos(updated);
      saveTodos(updated);
      */
      const newTodo = await db.addTodo(inputText.trim());
      setTodos([newTodo, ...todos]);
      setInputText('');
    } catch (e) {
      console.error('Failed to add todo', e);
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;
      
      /*
      const updated = todos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      );
      setTodos(updated);
      saveTodos(updated);
      */
      await db.toggleTodo(id, !todo.completed);
      setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    } catch (e) {
      console.error('Failed to toggle todo', e);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      /*
      const updated = todos.filter((t) => t.id !== id);
      setTodos(updated);
      saveTodos(updated);
      */
      await db.deleteTodo(id);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (e) {
      console.error('Failed to delete todo', e);
    }
  };

  const startEdit = (todo: db.Todo) => {
    setEditingTodo(todo);
    setEditText(todo.text);
  };

  const saveEdit = async () => {
    if (editingTodo && editText.trim().length > 0) {
      try {
        await db.updateTodo(editingTodo.id, editText.trim());
        setTodos(todos.map(t => t.id === editingTodo.id ? { ...t, text: editText.trim() } : t));
        setEditingTodo(null);
        setEditText('');
      } catch (e) {
        console.error('Failed to update todo', e);
      }
    }
  };

  const renderTodoItem = ({ item }: { item: db.Todo }) => (
    <Card style={[styles.todoItem, item.completed && styles.todoItemCompleted]}>
      <TouchableOpacity
        style={styles.todoTextContainer}
        onPress={() => toggleTodo(item.id)}
      >
        <View style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
          {item.completed && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
        </View>
        <Text style={[styles.todoText, item.completed && styles.todoTextCompleted]}>
          {item.text}
        </Text>
      </TouchableOpacity>
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => startEdit(item)} style={styles.editButton}>
          <Ionicons name="pencil-outline" size={20} color="#3B82F6" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteTodo(item.id)} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Tasks</Text>
            <Text style={styles.subtitle}>Keep track of your daily goals</Text>
          </View>

          <FlatList
            data={todos}
            renderItem={renderTodoItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="clipboard-outline" size={64} color="#CBD5E1" />
                <Text style={styles.emptyText}>No tasks yet. Add one below!</Text>
              </View>
            }
          />

          <Card style={styles.inputContainer}>
            <View style={styles.inputRow}>
              <View style={{ flex: 1 }}>
                <CustomInput
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="What needs to be done?"
                  onSubmitEditing={addTodo}
                />
              </View>
              <CustomButton
                title="Add"
                onPress={addTodo}
                style={styles.addButton}
              />
            </View>
          </Card>

          <Modal
            visible={!!editingTodo}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setEditingTodo(null)}
          >
            <View style={styles.modalOverlay}>
              <Card style={styles.modalContent}>
                <Text style={styles.modalTitle}>Edit Task</Text>
                <CustomInput
                  label="Task Name"
                  value={editText}
                  onChangeText={setEditText}
                  autoFocus
                />
                <View style={styles.modalButtons}>
                  <CustomButton
                    title="Cancel"
                    variant="outline"
                    onPress={() => setEditingTodo(null)}
                    style={styles.modalButton}
                  />
                  <CustomButton
                    title="Save Changes"
                    onPress={saveEdit}
                    style={styles.modalButton}
                  />
                </View>
              </Card>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    marginBottom: Spacing.four,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: 100,
    gap: Spacing.three,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    backgroundColor: '#FFFFFF',
  },
  todoItemCompleted: {
    opacity: 0.7,
    backgroundColor: '#F8FAFC',
  },
  todoTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  todoText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 64,
    gap: Spacing.four,
  },
  emptyText: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
  },
  inputContainer: {
    position: 'absolute',
    bottom: Spacing.four,
    left: Spacing.four,
    right: Spacing.four,
    padding: Spacing.two,
    backgroundColor: '#FFFFFF',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  addButton: {
    height: 52,
    paddingHorizontal: Spacing.four,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  modalContent: {
    width: '100%',
    gap: Spacing.four,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: Spacing.two,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  modalButton: {
    flex: 1,
  },
});
