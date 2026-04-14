import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import colors from '../utils/colors';
import Card from '../components/common/Card';
import Icon from '../components/common/Icon';
import { Svg, Path, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

const StatBox = ({ label, value, icon, color }) => (
  <Card style={styles.statBox}>
    <View style={[styles.statIconBg, { backgroundColor: `${color}15` }]}>
      <Icon name={icon} size={20} color={color} />
    </View>
    <View style={styles.statBoxContent}>
      <Text style={styles.statBoxLabel}>{label}</Text>
      <Text style={styles.statBoxValue}>{value}</Text>
    </View>
  </Card>
);

export default function AnalyticsScreen() {
  const [timeRange, setTimeRange] = useState('Week');
  const ranges = ['Day', 'Week', 'Month'];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
          <Text style={styles.subtitle}>Energy insights & forecasting</Text>
        </View>

        <View style={styles.statsRow}>
          <StatBox label="Avg. Daily" value="47.8 kWh" icon="bolt" color={colors.primary} />
          <StatBox label="Saved" value="15%" icon="bolt" color={colors.success} />
        </View>

        <View style={styles.rangeSelector}>
          {ranges.map(r => (
            <TouchableOpacity
              key={r}
              style={[styles.rangeBtn, timeRange === r && styles.activeRangeBtn]}
              onPress={() => setTimeRange(r)}
            >
              <Text style={[styles.rangeText, timeRange === r && styles.activeRangeText]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Energy Consumption</Text>
          <View style={styles.chartPlaceholder}>
            <Svg height="180" width="100%" viewBox="0 0 300 180">
              <Defs>
                <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={colors.primary} stopOpacity="0.3" />
                  <Stop offset="1" stopColor={colors.primary} stopOpacity="0" />
                </LinearGradient>
              </Defs>
              <Path
                d="M0,150 Q50,130 100,140 T200,80 T300,100 L300,180 L0,180 Z"
                fill="url(#grad)"
              />
              <Path
                d="M0,150 Q50,130 100,140 T200,80 T300,100"
                fill="none"
                stroke={colors.primary}
                strokeWidth="3"
              />
            </Svg>
          </View>
          <View style={styles.chartLegend}>
            <Text style={styles.legendText}>Mon</Text>
            <Text style={styles.legendText}>Wed</Text>
            <Text style={styles.legendText}>Fri</Text>
            <Text style={styles.legendText}>Sun</Text>
          </View>
        </Card>

        <Card style={styles.distributionCard}>
          <Text style={styles.chartTitle}>Device Distribution</Text>
          <View style={styles.distContent}>
            <View style={styles.piePlaceholder}>
                <Svg height="120" width="120" viewBox="0 0 100 100">
                    <Path d="M50,50 L50,0 A50,50 0 0,1 100,50 Z" fill={colors.primary} />
                    <Path d="M50,50 L100,50 A50,50 0 0,1 50,100 Z" fill={colors.success} />
                    <Path d="M50,50 L50,100 A50,50 0 0,1 0,50 Z" fill={colors.warning} />
                    <Path d="M50,50 L0,50 A50,50 0 0,1 50,0 Z" fill={colors.error} />
                </Svg>
            </View>
            <View style={styles.distLegend}>
                <View style={styles.legendItem}><View style={[styles.dot, {backgroundColor: colors.primary}]} /><Text style={styles.legendLabel}>AC (45%)</Text></View>
                <View style={styles.legendItem}><View style={[styles.dot, {backgroundColor: colors.success}]} /><Text style={styles.legendLabel}>Heater (25%)</Text></View>
                <View style={styles.legendItem}><View style={[styles.dot, {backgroundColor: colors.warning}]} /><Text style={styles.legendLabel}>Fridge (15%)</Text></View>
                <View style={styles.legendItem}><View style={[styles.dot, {backgroundColor: colors.error}]} /><Text style={styles.legendLabel}>Lights (8%)</Text></View>
            </View>
          </View>
        </Card>

        <Card style={styles.extraCard}>
           <View style={styles.extraHeader}>
              <View style={styles.extraIconBg}>
                <Icon name="bolt" size={24} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.extraTitle}>AI Forecast</Text>
                <Text style={styles.extraSubtitle}>Next 7 days prediction</Text>
              </View>
           </View>
           <View style={styles.forecastGrid}>
              <View style={styles.forecastItem}>
                <Text style={styles.forecastLabel}>Expected Usage</Text>
                <Text style={styles.forecastValue}>335 kWh</Text>
              </View>
              <View style={styles.forecastItem}>
                <Text style={styles.forecastLabel}>Est. Cost</Text>
                <Text style={styles.forecastValue}>$100.50</Text>
              </View>
              <View style={styles.forecastItem}>
                <Text style={styles.forecastLabel}>Peak Hour</Text>
                <Text style={styles.forecastValue}>6-8 PM</Text>
              </View>
           </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    padding: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statBox: {
    width: '48%',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statBoxLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  statBoxValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 2,
  },
  rangeSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  rangeBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeRangeBtn: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rangeText: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '500',
  },
  activeRangeText: {
    color: colors.text,
    fontWeight: 'bold',
  },
  chartCard: {
    padding: 20,
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  chartPlaceholder: {
    height: 180,
    marginBottom: 8,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  legendText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  distributionCard: {
    padding: 20,
    marginBottom: 24,
  },
  distContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  piePlaceholder: {
    marginRight: 24,
  },
  distLegend: {
    flex: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  legendLabel: {
    fontSize: 13,
    color: colors.text,
  },
  extraCard: {
    padding: 20,
    marginBottom: 24,
    backgroundColor: '#F8FAFC',
  },
  extraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  extraIconBg: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  extraTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  extraSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
  },
  forecastGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forecastItem: {
    flex: 1,
  },
  forecastLabel: {
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  forecastValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 4,
  },
});