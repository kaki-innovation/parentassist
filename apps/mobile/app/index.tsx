import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '@parentassist/config';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ParentAssist</Text>
      <Text style={styles.subtitle}>Less thinking, more doing ✨</Text>
      <Text style={styles.caption}>Session 1 — Foundation scaffold complete</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream[100],
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[6],
  },
  title: {
    fontSize: typography.sizes['3xl'],
    color: colors.saffron[500],
    fontWeight: 'bold',
    marginBottom: spacing[2],
  },
  subtitle: {
    fontSize: typography.sizes.lg,
    color: colors.neutral[700],
    marginBottom: spacing[4],
  },
  caption: {
    fontSize: typography.sizes.sm,
    color: colors.neutral[400],
  },
});
