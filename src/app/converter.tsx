import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Dropdown } from '@/components/dropdown';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

type ConverterCategory = 'Length' | 'Temperature' | 'Weight' | 'Currency';

type UnitMap = {
  [key in ConverterCategory]: readonly string[];
};

const unitOptions: UnitMap = {
  Length: ['Meter', 'Kilometer', 'Mile', 'Foot'],
  Temperature: ['Celsius', 'Fahrenheit', 'Kelvin'],
  Weight: ['Kilogram', 'Gram', 'Pound'],
  Currency: ['USD', 'EUR', 'GBP', 'NGN'],
};

const lengthToMeter: Record<string, number> = {
  Meter: 1,
  Kilometer: 1000,
  Mile: 1609.344,
  Foot: 0.3048,
};

const weightToKilogram: Record<string, number> = {
  Kilogram: 1,
  Gram: 0.001,
  Pound: 0.453592,
};

const currencyPerUsd: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  NGN: 1450,
};

function convertTemperature(value: number, fromUnit: string, toUnit: string) {
  const celsius =
    fromUnit === 'Celsius'
      ? value
      : fromUnit === 'Fahrenheit'
      ? ((value - 32) * 5) / 9
      : value - 273.15;

  if (toUnit === 'Celsius') {
    return celsius;
  }

  if (toUnit === 'Fahrenheit') {
    return (celsius * 9) / 5 + 32;
  }

  return celsius + 273.15;
}

function convertValue(
  category: ConverterCategory,
  value: number,
  fromUnit: string,
  toUnit: string
) {
  if (category === 'Length') {
    return (value * lengthToMeter[fromUnit]) / lengthToMeter[toUnit];
  }

  if (category === 'Weight') {
    return (value * weightToKilogram[fromUnit]) / weightToKilogram[toUnit];
  }

  if (category === 'Temperature') {
    return convertTemperature(value, fromUnit, toUnit);
  }

  const usdValue = value / currencyPerUsd[fromUnit];
  return usdValue * currencyPerUsd[toUnit];
}

export default function ConverterScreen() {
  const [category, setCategory] = useState<ConverterCategory>('Length');
  const [fromUnit, setFromUnit] = useState(unitOptions.Length[0]);
  const [toUnit, setToUnit] = useState(unitOptions.Length[1]);
  const [inputValue, setInputValue] = useState('1');

  const result = useMemo(() => {
    const parsed = Number(inputValue);
    if (!Number.isFinite(parsed)) {
      return 'Enter a valid number';
    }

    const converted = convertValue(category, parsed, fromUnit, toUnit);
    const decimals = category === 'Currency' ? 2 : 4;
    return `${converted.toFixed(decimals)} ${toUnit}`;
  }, [category, fromUnit, inputValue, toUnit]);

  const currentUnits = unitOptions[category];

  function handleCategorySelect(nextCategory: ConverterCategory) {
    const nextUnits = unitOptions[nextCategory];
    setCategory(nextCategory);
    setFromUnit(nextUnits[0]);
    setToUnit(nextUnits[1] ?? nextUnits[0]);
  }

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <ThemedText type="title">Unit Converter</ThemedText>

          <Dropdown
            label="Category"
            items={Object.keys(unitOptions) as ConverterCategory[]}
            selectedValue={category}
            onSelect={handleCategorySelect}
          />

          <ThemedView style={styles.conversionContainer}>
            <Dropdown
              label="From"
              items={currentUnits}
              selectedValue={fromUnit}
              onSelect={setFromUnit}
            />
            <TextInput
              keyboardType="decimal-pad"
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="Enter value"
              style={styles.input}
            />
          </ThemedView>

          <ThemedView style={styles.conversionContainer}>
            <Dropdown label="To" items={currentUnits} selectedValue={toUnit} onSelect={setToUnit} />
            <ThemedView style={styles.resultCard}>
              <ThemedText type="subtitle" style={styles.resultText}>
                {result}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
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
    paddingVertical: Spacing.six,
    gap: Spacing.four,
  },
  conversionContainer: {
    gap: Spacing.two,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    paddingTop: Spacing.four,
  },
  input: {
    borderRadius: Spacing.two,
    backgroundColor: '#FFFFFF',
    color: '#1E3A8A',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  resultCard: {
    borderRadius: Spacing.two,
    padding: Spacing.three,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  resultText: {
    fontSize: 24,
    lineHeight: 32,
    color: '#1E3A8A',
  },
});
