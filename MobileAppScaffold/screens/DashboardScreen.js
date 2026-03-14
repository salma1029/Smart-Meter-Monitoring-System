import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import colors from '../utils/colors';
import font from '../assets/fonts/font';

const DashboardScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Saturday, Mar 14</Text>
      
      <View style={styles.liveCard}>
        <Text style={styles.liveLabel}>● Live</Text>
        <View style={styles.liveValueRow}>
          <Text style={styles.liveValue}>3.29</Text>
          <Text style={styles.liveUnit}> kW</Text>
        </View>
        <Text style={styles.liveDesc}>Current consumption</Text>
        <View style={styles.chartPlaceholder} />
      </View>
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Top Consumers</Text>
        <Text style={styles.viewAll}>View All</Text>
      </View>
      <View style={styles.listCard}>
        <Text style={styles.listItem}>Air Conditioner - 45%</Text>
        <Text style={styles.listItem}>Water Heater - 34%</Text>
        <Text style={styles.listItem}>Refrigerator - 15%</Text>
      </View>
      
      <Text style={styles.sectionTitle}>Recent Alert</Text>
      <View style={styles.alertCard}>
        <Text style={styles.alertTitle}>High Power Usage</Text>
        <Text style={styles.alertDesc}>Your AC has been running continuously for 6 hours</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  title: { ...font.title, color: colors.text, marginTop: 40 },
  subtitle: { ...font.regular, color: colors.muted, marginBottom: 20 },
  liveCard: { backgroundColor: colors.text, padding: 20, borderRadius: 12, marginBottom: 24 },
  liveLabel: { color: colors.primary, ...font.bold, marginBottom: 8 },
  liveValueRow: { flexDirection: 'row', alignItems: 'baseline' },
  liveValue: { fontSize: 48, fontWeight: 'bold', color: colors.surface },
  liveUnit: { fontSize: 24, color: colors.surface },
  liveDesc: { color: colors.muted, marginBottom: 16 },
  chartPlaceholder: { height: 100, borderTopWidth: 1, borderColor: colors.muted, marginTop: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { ...font.header, color: colors.text, marginBottom: 12, marginTop: 8 },
  viewAll: { ...font.regular, color: colors.primary },
  listCard: { backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 16, marginBottom: 24 },
  listItem: { ...font.regular, color: colors.text, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  alertCard: { backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 16, marginBottom: 40 },
  alertTitle: { ...font.bold, color: colors.text, marginBottom: 4 },
  alertDesc: { ...font.regular, color: colors.muted },
});

export default DashboardScreen;
