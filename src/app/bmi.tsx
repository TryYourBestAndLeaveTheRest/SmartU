import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

function getBmiLabel(bmi: number) {
  if (bmi < 18.5) {
    return 'Underweight';
  }
  if (bmi < 25) {
    return 'Normal';
  }
  if (bmi < 30) {
    return 'Overweight';
  }
  return 'Obese';
}

export default function BmiScreen() {
  const [weightKg, setWeightKg] = useState('70');
  const [heightCm, setHeightCm] = useState('170');
  const [submitted, setSubmitted] = useState(false);

  const bmi = useMemo(() => {
    const weight = Number(weightKg);
    const height = Number(heightCm) / 100;

    if (!Number.isFinite(weight) || !Number.isFinite(height) || height <= 0) {
      return null;
    }

    return weight / (height * height);
  }, [heightCm, weightKg]);

  const status = bmi === null ? 'Invalid input' : getBmiLabel(bmi);

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <ThemedText type="subtitle">BMI Calculator</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Check your body mass index using your height and weight.
          </ThemedText>

          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="smallBold">Weight (kg)</ThemedText>
            <TextInput
              value={weightKg}
              onChangeText={setWeightKg}
              keyboardType="decimal-pad"
              style={styles.input}
              placeholder="Enter weight in kilograms"
            />

            <ThemedText type="smallBold">Height (cm)</ThemedText>
            <TextInput
              value={heightCm}
              onChangeText={setHeightCm}
              keyboardType="decimal-pad"
              style={styles.input}
              placeholder="Enter height in centimeters"
            />

            <Pressable style={({ pressed }) => [styles.button, pressed && styles.pressed]} onPress={() => setSubmitted(true)}>
              <ThemedView type="backgroundSelected" style={styles.buttonInner}>
                <ThemedText type="smallBold">Calculate BMI</ThemedText>
              </ThemedView>
            </Pressable>
          </ThemedView>

          {submitted && (
            <ThemedView type="backgroundSelected" style={styles.resultCard}>
              <ThemedText type="smallBold">Result</ThemedText>
              <ThemedText type="subtitle" style={styles.bmiText}>
                {bmi === null ? '--' : bmi.toFixed(1)}
              </ThemedText>
              <ThemedText type="default">{status}</ThemedText>
            </ThemedView>
          )}
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
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  input: {
    borderRadius: Spacing.three,
    backgroundColor: '#ffffff',
    color: '#111111',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  button: {
    alignSelf: 'flex-start',
    borderRadius: Spacing.three,
    marginTop: Spacing.one,
  },
  buttonInner: {
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  pressed: {
    opacity: 0.8,
  },
  resultCard: {
    borderRadius: Spacing.four,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  bmiText: {
    fontSize: 32,
    lineHeight: 40,
  },
});
