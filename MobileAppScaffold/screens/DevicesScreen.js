import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import colors from '../utils/colors';
import Card from '../components/common/Card';
import Icon from '../components/common/Icon';

const DeviceItem = ({ name, status, consumption, todayUsage, change }) => (
  <Card style={styles.deviceCard}>
    <View style={styles.deviceInfo}>
      <View style={styles.deviceHeader}>
        <Text style={styles.deviceName}>{name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: status === 'active' ? `${colors.success}15` : `${colors.textMuted}15` }]}>
          <Text style={[styles.statusText, { color: status === 'active' ? colors.success : colors.textMuted }]}>{status}</Text>
        </View>
      </View>
      <View style={styles.deviceUsageRow}>
        <Text style={styles.consumptionText}>{consumption} kW</Text>
        <Text style={styles.usageDot}>•</Text>
        <Text style={styles.todayUsageText}>{todayUsage} kWh today</Text>
      </View>
    </View>
    <View style={styles.deviceTrend}>
      <View style={styles.trendIndicator}>
        <Icon name="trending-up" size={16} color={change.startsWith('-') ? colors.success : colors.error} />
        <Text style={[styles.trendText, { color: change.startsWith('-') ? colors.success : colors.error }]}>{change}</Text>
      </View>
    </View>
  </Card>
);

export default function DevicesScreen() {
  const [filter, setFilter] = useState('All');

  const filters = ['All', 'Active', 'Standby', 'Off'];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Devices</Text>
          <Text style={styles.subtitle}>NILM Detection System</Text>
        </View>

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <View style={styles.statIconBg}>
              <Icon name="bolt" size={20} color={colors.text} />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Active</Text>
              <Text style={styles.statValue}>4</Text>
            </View>
          </Card>
          <Card style={styles.statCard}>
            <View style={styles.statIconBg}>
              <Icon name="bolt" size={20} color={colors.text} />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Total Load</Text>
              <Text style={styles.statValue}>5.2 kW</Text>
            </View>
          </Card>
        </View>

        <View style={styles.filterContainer}>
          {filters.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, filter === f && styles.activeFilterBtn]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.activeFilterText]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <DeviceItem name="Air Conditioner" status="active" consumption="2.4" todayUsage="18.5" change="-12%" />
        <DeviceItem name="Water Heater" status="active" consumption="1.8" todayUsage="12.3" change="+5%" />
        <DeviceItem name="Refrigerator" status="active" consumption="0.8" todayUsage="9.2" change="+3%" />
        <DeviceItem name="Washing Machine" status="idle" consumption="0.3" todayUsage="2.4" change="-8%" />
        <DeviceItem name="TV" status="active" consumption="0.15" todayUsage="3.6" change="-2%" />
        <DeviceItem name="Microwave" status="off" consumption="0" todayUsage="0.8" change="+15%" />

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
    marginBottom: 32,
  },
  statCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  statIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeFilterBtn: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  filterText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  activeFilterText: {
    color: colors.white,
  },
  deviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginBottom: 16,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  deviceUsageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  consumptionText: {
    fontSize: 14,
    color: colors.text,
  },
  usageDot: {
    marginHorizontal: 8,
    color: colors.textMuted,
  },
  todayUsageText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});