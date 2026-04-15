import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { Spacing } from '@/constants/theme';

type DropdownProps<T extends string> = {
  label: string;
  items: readonly T[];
  selectedValue: T;
  onSelect: (value: T) => void;
};

export function Dropdown<T extends string>({
  label,
  items,
  selectedValue,
  onSelect,
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (value: T) => {
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <ThemedText type="smallBold">{label}</ThemedText>
      <Pressable onPress={() => setIsOpen(!isOpen)}>
        <ThemedView type="backgroundElement" style={styles.dropdownHeader}>
          <ThemedText>{selectedValue}</ThemedText>
        </ThemedView>
      </Pressable>
      {isOpen && (
        <ThemedView type="backgroundElement" style={styles.dropdownList}>
          {items.map((item) => (
            <Pressable key={item} onPress={() => handleSelect(item)} style={styles.dropdownItem}>
              <ThemedText>{item}</ThemedText>
            </Pressable>
          ))}
        </ThemedView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },
  dropdownHeader: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  dropdownList: {
    marginTop: Spacing.one,
    borderRadius: Spacing.two,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  dropdownItem: {
    padding: Spacing.three,
  },
});