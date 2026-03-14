import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import colors from '../utils/colors';
import font from '../assets/fonts/font';

const AnalyticsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Analytics</Text>
      <Text style={styles.subtitle}>Energy insights & forecasting</Text>
      
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.mutedText}>Avg. Daily</Text>
          <Text style={styles.summaryValue}>47.8 kWh</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.mutedText}>Saved</Text>
          <Text style={styles.summaryValue}>15%</Text>
        </View>
      </View>
      
      <View style={styles.tabsRow}>
        <Text style={styles.tab}>Day</Text>
        <Text style={[styles.tab, styles.activeTab]}>Week</Text>
        <Text style={styles.tab}>Month</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Energy Consumption</Text>
        <View style={styles.chartPlaceholder}><Text style={styles.mutedText}>Line Chart Area</Text></View>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Cost Analysis</Text>
        <View style={styles.chartPlaceholder}><Text style={styles.mutedText}>Bar Chart Area</Text></View>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Device Distribution</Text>
        <View style={[styles.chartPlaceholder, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }]}>
          <View style={styles.donutPlaceholder} />
          <View>
            <Text style={styles.legendText}>● AC: 45%</Text>
            <Text style={styles.legendText}>● Heater: 25%</Text>
            <Text style={styles.legendText}>● Fridge: 15%</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  title: { ...font.title, color: colors.text, marginTop: 40 },
  subtitle: { ...font.regular, color: colors.muted, marginBottom: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  summaryCard: { flex: 1, backgroundColor: colors.surface, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border, marginHorizontal: 4 },
  mutedText: { ...font.regular, color: colors.muted, marginBottom: 8 },
  summaryValue: { fontSize: 24, fontWeight: 'bold', color: colors.text },
  tabsRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24, backgroundColor: colors.border, borderRadius: 8, padding: 4 },
  tab: { flex: 1, textAlign: 'center', paddingVertical: 8, ...font.bold, color: colors.text },
  activeTab: { backgroundColor: colors.text, color: colors.surface, borderRadius: 6 },
  card: { backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 16, marginBottom: 24 },
  cardTitle: { ...font.header, color: colors.text, marginBottom: 16 },
  chartPlaceholder: { height: 150, backgroundColor: colors.background, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  donutPlaceholder: { width: 100, height: 100, borderRadius: 50, borderWidth: 20, borderColor: colors.primary },
  legendText: { ...font.regular, color: colors.text, marginBottom: 4 },
});

export default AnalyticsScreen;
