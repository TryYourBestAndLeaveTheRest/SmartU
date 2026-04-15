import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

const modules = [
  {
    title: 'Unit Converter',
    description: 'Convert length, temperature, weight, and currency instantly.',
    route: '/converter',
  },
  {
    title: 'Quick Notes',
    description: 'Capture and manage notes for reminders and daily tasks.',
    route: '/explore',
  },
  {
    title: 'BMI Calculator',
    description: 'Calculate body mass index and get a quick health range indicator.',
    route: '/bmi',
  },
] as const;

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedView style={styles.hero}>
            <ThemedText type="title" style={styles.title}>
              Smart Utility Toolkit
            </ThemedText>
            <ThemedText type="default" themeColor="textSecondary" style={styles.subtitle}>
              Everyday tools in one place. Choose a module to get started.
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.moduleList}>
            {modules.map((module) => (
              <Pressable
                key={module.title}
                style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
                onPress={() => router.push(module.route)}>
                <ThemedView type="backgroundElement" style={styles.card}>
                  <ThemedText type="subtitle" style={styles.cardTitle}>
                    {module.title}
                  </ThemedText>
                  <ThemedText type="default" themeColor="textSecondary">
                    {module.description}
                  </ThemedText>
                </ThemedView>
              </Pressable>
            ))}
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.footerBox}>
            <ThemedText type="smallBold">Built for Stage 0</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Clean architecture, smooth navigation, and practical utility-focused UX.
            </ThemedText>
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingBottom: BottomTabInset,
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.five,
    gap: Spacing.three,
  },
  hero: {
    gap: Spacing.two,
  },
  title: {
    fontSize: 36,
    lineHeight: 42,
  },
  subtitle: {
    maxWidth: 560,
  },
  moduleList: {
    gap: Spacing.three,
  },
  pressable: {
    borderRadius: Spacing.four,
  },
  pressed: {
    opacity: 0.8,
  },
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  cardTitle: {
    fontSize: 24,
    lineHeight: 32,
  },
  footerBox: {
    marginTop: Spacing.one,
    borderRadius: Spacing.four,
    padding: Spacing.three,
    gap: Spacing.one,
  },
});
