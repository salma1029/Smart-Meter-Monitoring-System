import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import colors from '../utils/colors';
import Card from '../components/common/Card';
import Icon from '../components/common/Icon';

const AlertItem = ({ title, type, description, time, location, status }) => (
  <Card style={[styles.alertCard, type === 'CRITICAL' && styles.criticalAlert]}>
    <View style={styles.alertHeader}>
      <View style={styles.alertTitleRow}>
        <View style={[styles.typeBadge, { backgroundColor: type === 'CRITICAL' ? colors.error : colors.warning }]}>
          <Text style={styles.typeBadgeText}>{type}</Text>
        </View>
        <Text style={styles.alertTitle}>{title}</Text>
      </View>
      <Text style={styles.alertTime}>{time}</Text>
    </View>
    <Text style={styles.alertDescription}>{description}</Text>
    <View style={styles.alertFooter}>
      <View style={styles.locationContainer}>
        <Icon name="bolt" size={14} color={colors.textMuted} />
        <Text style={styles.locationText}>{location}</Text>
      </View>
      {status === 'Active' ? (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.detailsBtn}>
            <Text style={styles.detailsBtnText}>Details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resolveBtn}>
            <Text style={styles.resolveBtnText}>Resolve</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.resolvedBadge}>
          <Icon name="bolt" size={14} color={colors.success} />
          <Text style={styles.resolvedText}>Resolved</Text>
        </View>
      )}
    </View>
  </Card>
);

export default function AlertsScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Alerts</Text>
          <Text style={styles.subtitle}>AI-powered anomaly detection</Text>
        </View>

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Icon name="bolt" size={20} color={colors.error} />
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Critical</Text>
              <Text style={styles.statValue}>1</Text>
            </View>
          </Card>
          <Card style={styles.statCard}>
            <Icon name="bolt" size={20} color={colors.success} />
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Resolved</Text>
              <Text style={styles.statValue}>12</Text>
            </View>
          </Card>
        </View>

        <Text style={styles.sectionTitle}>Active Alerts</Text>
        <AlertItem
          title="Power Spike Detected"
          type="CRITICAL"
          description="Unusual power surge detected in the main circuit"
          time="10 mins ago"
          location="Main Panel"
          status="Active"
        />
        <AlertItem
          title="High Power Usage"
          type="WARNING"
          description="AC running continuously for 6 hours"
          time="2 hours ago"
          location="Living Room"
          status="Active"
        />

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Recently Resolved</Text>
        <AlertItem
          title="Energy Efficiency Alert"
          type="RESOLVED"
          description="Standby power consumption is higher than usual"
          time="1 day ago"
          location="Kitchen"
          status="Resolved"
        />

        <TouchableOpacity style={styles.settingsCard}>
          <View style={styles.settingsIcon}>
            <Icon name="bolt" size={24} color={colors.white} />
          </View>
          <View style={styles.settingsContent}>
            <Text style={styles.settingsTitle}>Alert Settings</Text>
            <Text style={styles.settingsSubtitle}>Customize your notification preferences</Text>
          </View>
          <Icon name="bolt" size={24} color={colors.textMuted} />
        </TouchableOpacity>
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
  statContent: {
    marginLeft: 12,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  alertCard: {
    marginBottom: 16,
    padding: 16,
  },
  criticalAlert: {
    borderColor: colors.error,
    borderWidth: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  alertTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 10,
  },
  typeBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '900',
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  alertTime: {
    fontSize: 12,
    color: colors.textMuted,
  },
  alertDescription: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: 16,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: colors.textMuted,
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  detailsBtn: {
    marginRight: 12,
  },
  detailsBtnText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  resolveBtnText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  resolvedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resolvedText: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  settingsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.text,
    padding: 16,
    borderRadius: 16,
    marginTop: 24,
  },
  settingsIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingsContent: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  settingsSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
});