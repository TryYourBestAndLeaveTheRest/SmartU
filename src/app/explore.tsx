import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

type Note = {
  id: string;
  text: string;
  createdAt: string;
};

const NOTES_STORAGE_KEY = 'smartu_notes';

export default function NotesScreen() {
  const [draft, setDraft] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    void loadNotes();
  }, []);

  async function loadNotes() {
    try {
      const savedNotes = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes) as Note[]);
      }
    } catch (error) {
      console.warn('Failed to load notes', error);
    }
  }

  async function persistNotes(nextNotes: Note[]) {
    setNotes(nextNotes);
    await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(nextNotes));
  }

  async function addNote() {
    const text = draft.trim();
    if (!text) {
      Alert.alert('Empty note', 'Write something before saving.');
      return;
    }

    const nextNotes: Note[] = [
      {
        id: `${Date.now()}`,
        text,
        createdAt: new Date().toISOString(),
      },
      ...notes,
    ];

    setDraft('');
    await persistNotes(nextNotes);
  }

  async function removeNote(id: string) {
    const nextNotes = notes.filter((note) => note.id !== id);
    await persistNotes(nextNotes);
  }

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <ThemedText type="subtitle">Quick Notes</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Save short notes for reminders, ideas, and to-dos.
          </ThemedText>

          <ThemedView type="backgroundElement" style={styles.editorCard}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Write your note here"
              multiline
              style={styles.input}
            />

            <Pressable style={({ pressed }) => [styles.addButton, pressed && styles.pressed]} onPress={addNote}>
              <ThemedView type="backgroundSelected" style={styles.addButtonInner}>
                <ThemedText type="smallBold">Save Note</ThemedText>
              </ThemedView>
            </Pressable>
          </ThemedView>

          <ThemedView style={styles.noteList}>
            {notes.length === 0 ? (
              <ThemedView type="backgroundElement" style={styles.emptyState}>
                <ThemedText type="small" themeColor="textSecondary">
                  No notes yet. Add your first note above.
                </ThemedText>
              </ThemedView>
            ) : (
              notes.map((note) => (
                <ThemedView key={note.id} type="backgroundElement" style={styles.noteCard}>
                  <ThemedText type="default">{note.text}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {new Date(note.createdAt).toLocaleString()}
                  </ThemedText>
                  <Pressable
                    style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}
                    onPress={() => removeNote(note.id)}>
                    <ThemedText type="smallBold">Delete</ThemedText>
                  </Pressable>
                </ThemedView>
              ))
            )}
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: BottomTabInset,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    gap: Spacing.three,
  },
  editorCard: {
    borderRadius: Spacing.four,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  input: {
    minHeight: 120,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    backgroundColor: '#ffffff',
    color: '#111111',
    textAlignVertical: 'top',
    fontSize: 16,
  },
  addButton: {
    alignSelf: 'flex-start',
    borderRadius: Spacing.three,
  },
  addButtonInner: {
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  pressed: {
    opacity: 0.8,
  },
  noteList: {
    gap: Spacing.two,
  },
  emptyState: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
  },
  noteCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  deleteButton: {
    alignSelf: 'flex-start',
    marginTop: Spacing.one,
  },
});
