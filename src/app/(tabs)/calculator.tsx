import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Spacing } from '@/constants/theme';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/Card';

const { width } = Dimensions.get('window');
const BUTTON_SIZE = (width - Spacing.four * 2 - Spacing.three * 3) / 4;

export default function CalculatorScreen() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handlePress = (value: string) => {
    if (value === 'AC') {
      setDisplay('0');
      setEquation('');
    } else if (value === '=') {
      try {
        // Simple safety check for valid characters
        if (!/^[0-9+\-*/.() ]+$/.test(equation)) {
          throw new Error('Invalid input');
        }
        // Use Function instead of eval for slightly better safety in this context
        const result = new Function(`return ${equation}`)();
        const formattedResult = Number.isInteger(result) ? result.toString() : result.toFixed(8).replace(/\.?0+$/, '');
        setDisplay(formattedResult);
        setEquation(formattedResult);
      } catch (e) {
        setDisplay('Error');
      }
    } else if (['+', '-', '*', '/'].includes(value)) {
      setEquation((prev) => prev + value);
      setDisplay(value);
    } else {
      setEquation((prev) => (prev === '0' ? value : prev + value));
      setDisplay((prev) => (prev === '0' || ['+', '-', '*', '/'].includes(prev) ? value : prev + value));
    }
  };

  const renderButton = (label: string, type: 'num' | 'op' | 'action' = 'num') => {
    const isDouble = label === '0';
    return (
      <TouchableOpacity
        key={label}
        style={[
          styles.button,
          type === 'op' && styles.opButton,
          type === 'action' && styles.actionButton,
          isDouble && styles.doubleButton,
        ]}
        onPress={() => handlePress(label === '×' ? '*' : label === '÷' ? '/' : label)}
      >
        <Text style={[
          styles.buttonText,
          type === 'op' && styles.opButtonText,
          type === 'action' && styles.actionButtonText,
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const buttons = [
    ['AC', '+/-', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
  ];

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.displayContainer}>
            <Text style={styles.equationText} numberOfLines={1}>{equation}</Text>
            <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>{display}</Text>
          </View>

          <Card style={styles.keypadCard}>
            <View style={styles.grid}>
              {buttons.map((row) => (
                <View key={row.join('-')} style={styles.row}>
                  {row.map((btn) => {
                    let type: 'num' | 'op' | 'action' = 'num';
                    if (['÷', '×', '-', '+', '='].includes(btn)) type = 'op';
                    if (['AC', '+/-', '%'].includes(btn)) type = 'action';
                    return renderButton(btn, type);
                  })}
                </View>
              ))}
            </View>
          </Card>
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
    justifyContent: 'flex-end',
    gap: Spacing.six,
  },
  displayContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.two,
    gap: Spacing.two,
  },
  equationText: {
    fontSize: 20,
    color: '#94A3B8',
    fontWeight: '500',
  },
  displayText: {
    fontSize: 64,
    fontWeight: '800',
    color: '#1E293B',
  },
  keypadCard: {
    padding: Spacing.three,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  grid: {
    gap: Spacing.three,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  doubleButton: {
    width: BUTTON_SIZE * 2 + Spacing.three,
    alignItems: 'flex-start',
    paddingLeft: BUTTON_SIZE * 0.4,
  },
  opButton: {
    backgroundColor: '#3B82F6',
  },
  actionButton: {
    backgroundColor: '#E2E8F0',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E293B',
  },
  opButtonText: {
    color: '#FFFFFF',
  },
  actionButtonText: {
    color: '#475569',
  },
});
