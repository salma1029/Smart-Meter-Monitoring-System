import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import colors from '../utils/colors';
import Card from '../components/common/Card';
import Icon from '../components/common/Icon';

const StatCard = ({ title, value, unit, icon, color }) => (
  <Card style={styles.statCard}>
    <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
      <Icon name={icon} size={20} color={color} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statUnit}>{unit} {title}</Text>
  </Card>
);

const ConsumerItem = ({ name, percentage, value, label, progress }) => (
  <View style={styles.consumerItem}>
    <View style={styles.consumerHeader}>
      <Text style={styles.consumerName}>{name}</Text>
      <Text style={styles.consumerPercentage}>{percentage}%</Text>
    </View>
    <View style={styles.consumerDetails}>
      <Text style={styles.consumerValue}>{value} kW</Text>
      <Text style={styles.consumerLabel}>{label} today</Text>
    </View>
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: colors.primary }]} />
    </View>
  </View>
);

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Dashboard</Text>
            <Text style={styles.date}>Saturday, Mar 14</Text>
          </View>
        </View>

        <Card style={styles.mainUsageCard}>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live</Text>
          </View>
          <View style={styles.usageContainer}>
            <Text style={styles.usageValue}>3.29</Text>
            <Text style={styles.usageUnit}>kW</Text>
          </View>
          <Text style={styles.usageLabel}>Current consumption</Text>
          {/* Chart placeholder */}
          <View style={styles.chartPlaceholder}>
            <Icon name="trending-up" size={100} color="rgba(255,255,255,0.3)" />
          </View>
        </Card>

        <View style={styles.statsGrid}>
          <StatCard title="Today" value="47.8" unit="kWh" icon="bolt" color={colors.primary} />
          <StatCard title="Month" value="1,240" unit="kWh" icon="bolt" color={colors.secondary} />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Consumers</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllBtn}>View All</Text>
          </TouchableOpacity>
        </View>

        <Card style={styles.consumersCard}>
          <ConsumerItem name="Air Conditioner" percentage={45} value="2.4" label="19.2 kWh" progress={45} />
          <ConsumerItem name="Water Heater" percentage={34} value="1.8" label="14.4 kWh" progress={34} />
          <ConsumerItem name="Refrigerator" percentage={15} value="0.8" label="6.4 kWh" progress={15} />
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Alert</Text>
        </View>

        <Card style={styles.alertCard}>
          <View style={styles.alertIconBg}>
            <Icon name="bolt" size={24} color={colors.warning} />
          </View>
          <View style={styles.alertContent}>
            <View style={styles.alertHeader}>
              <Text style={styles.alertTitle}>High Power Usage</Text>
              <Text style={styles.alertBadge}>WARNING</Text>
            </View>
            <Text style={styles.alertDescription}>Your AC has been running continuously for 6 hours</Text>
            <Text style={styles.alertTime}>2 hours ago</Text>
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
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  date: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 2,
  },
  notificationBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  mainUsageCard: {
    backgroundColor: colors.primary,
    padding: 24,
    marginBottom: 24,
    borderColor: colors.primary,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surface,
    marginRight: 6,
  },
  liveText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '600',
  },
  usageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  usageValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.surface,
  },
  usageUnit: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
    marginLeft: 6,
  },
  usageLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 24,
  },
  chartPlaceholder: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    width: '48%',
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  statUnit: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  viewAllBtn: {
    color: colors.primary,
    fontWeight: '600',
  },
  consumersCard: {
    padding: 16,
    marginBottom: 32,
  },
  consumerItem: {
    marginBottom: 20,
  },
  consumerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  consumerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  consumerPercentage: {
    fontSize: 14,
    color: colors.textMuted,
  },
  consumerDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  consumerValue: {
    fontSize: 14,
    color: colors.text,
  },
  consumerLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  alertCard: {
    flexDirection: 'row',
    padding: 16,
    borderColor: colors.warning,
    borderWidth: 1,
  },
  alertIconBg: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: `${colors.warning}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  alertContent: {
    flex: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  alertBadge: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.warning,
    backgroundColor: `${colors.warning}15`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  alertDescription: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: 8,
  },
  alertTime: {
    fontSize: 12,
    color: colors.textMuted,
  },
});