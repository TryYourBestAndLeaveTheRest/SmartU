import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Dropdown } from '@/components/dropdown';
import { Spacing } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { CustomInput } from '@/components/ui/CustomInput';

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

  if (toUnit === 'Celsius') return celsius;
  if (toUnit === 'Fahrenheit') return (celsius * 9) / 5 + 32;
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
    const parsed = parseFloat(inputValue);
    if (isNaN(parsed)) return '0.00';
    const converted = convertValue(category, parsed, fromUnit, toUnit);
    const decimals = category === 'Currency' ? 2 : 4;
    return converted.toFixed(decimals);
  }, [category, fromUnit, inputValue, toUnit]);

  const currentUnits = unitOptions[category];

  const handleCategorySelect = (nextCategory: ConverterCategory) => {
    const nextUnits = unitOptions[nextCategory];
    setCategory(nextCategory);
    setFromUnit(nextUnits[0]);
    setToUnit(nextUnits[1] ?? nextUnits[0]);
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.content} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>Unit Converter</ThemedText>
            <ThemedText style={styles.subtitle}>Convert between various units instantly</ThemedText>
          </View>

          <Card style={styles.categoryCard}>
            <Dropdown
              label="Select Category"
              items={Object.keys(unitOptions) as ConverterCategory[]}
              selectedValue={category}
              onSelect={handleCategorySelect}
            />
          </Card>

          <View style={styles.conversionSection}>
            <Card style={styles.inputCard}>
              <Dropdown
                label="From"
                items={currentUnits}
                selectedValue={fromUnit}
                onSelect={setFromUnit}
              />
              <CustomInput
                label="Amount"
                keyboardType="numeric"
                value={inputValue}
                onChangeText={setInputValue}
                placeholder="0.00"
              />
            </Card>

            <View style={styles.swapContainer}>
              <View style={styles.swapLine} />
              <View style={styles.swapButtonContainer}>
               <Ionicons 
                  name="swap-vertical" 
                  size={24} 
                  color="#3B82F6" 
                  onPress={swapUnits}
                  style={styles.swapIcon}
                />
              </View>
              <View style={styles.swapLine} />
            </View>

            <Card style={styles.resultCard}>
              <Dropdown
                label="To"
                items={currentUnits}
                selectedValue={toUnit}
                onSelect={setToUnit}
              />
              <View style={styles.resultValueContainer}>
                <Text style={styles.resultLabel}>Result</Text>
                <Text style={styles.resultValue} numberOfLines={1} adjustsFontSizeToFit>
                  {result} <Text style={styles.resultUnit}>{toUnit}</Text>
                </Text>
              </View>
            </Card>
          </View>
        </ScrollView>
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
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
    gap: Spacing.six,
  },
  header: {
    marginBottom: Spacing.two,
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
  categoryCard: {
    padding: Spacing.three,
  },
  conversionSection: {
    gap: 0,
  },
  inputCard: {
    gap: Spacing.four,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    zIndex: 1,
  },
  swapContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: -20,
    zIndex: 2,
  },
  swapLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  swapButtonContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  swapIcon: {
    padding: 8,
  },
  resultCard: {
    gap: Spacing.four,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  resultValueContainer: {
    marginTop: Spacing.two,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E293B',
  },
  resultUnit: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3B82F6',
  },
});
