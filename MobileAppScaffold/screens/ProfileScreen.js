import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import colors from '../utils/colors';
import Card from '../components/common/Card';
import Icon from '../components/common/Icon';
import PrimaryButton from '../components/buttons/PrimaryButton';

const ProfileInfoRow = ({ label, value, icon }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIconBg}>
      <Icon name={icon} size={20} color={colors.text} />
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const SettingItem = ({ title, subtitle, icon, rightElement }) => (
  <TouchableOpacity style={styles.settingItem}>
    <View style={styles.settingIconBg}>
      <Icon name={icon} size={20} color={colors.text} />
    </View>
    <View style={styles.settingText}>
      <Text style={styles.settingTitle}>{title}</Text>
      {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
    </View>
    {rightElement || <Icon name="bolt" size={20} color={colors.textMuted} />}
  </TouchableOpacity>
);

export default function ProfileScreen({ navigation }) {
  const handleSignOut = () => {
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Account & settings</Text>
        </View>

        <Card style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>JD</Text>
            <View style={styles.verifiedBadge}>
              <Icon name="bolt" size={12} color={colors.white} />
            </View>
          </View>
          <View style={styles.profileMain}>
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userTier}>Premium Member</Text>
            <View style={styles.statusRow}>
              <View style={styles.activeStatus}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Active</Text>
              </View>
            </View>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Contact Information</Text>
        <Card style={styles.infoCard}>
          <ProfileInfoRow label="Email" value="john.doe@example.com" icon="bell" />
          <View style={styles.divider} />
          <ProfileInfoRow label="Phone" value="+1 (555) 123-4567" icon="bolt" />
          <View style={styles.divider} />
          <ProfileInfoRow label="Address" value="123 Smart St, Tech City" icon="bolt" />
        </Card>

        <Text style={styles.sectionTitle}>Smart Meter</Text>
        <Card style={styles.meterCard}>
          <View style={styles.meterInfoItem}>
            <Text style={styles.meterLabel}>Meter ID</Text>
            <Text style={styles.meterValue}>SM-2024-00123</Text>
          </View>
          <View style={styles.meterInfoItem}>
            <Text style={styles.meterLabel}>Installed</Text>
            <Text style={styles.meterValue}>Jan 15, 2024</Text>
          </View>
          <View style={styles.meterInfoItem}>
            <Text style={styles.meterLabel}>Connection</Text>
            <View style={styles.connectionBadge}>
              <Icon name="bolt" size={14} color={colors.success} />
              <Text style={styles.connectionText}>PLC + RF</Text>
            </View>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Settings</Text>
        <Card style={styles.settingsCard}>
          <SettingItem
            title="Notifications"
            subtitle="Alerts & updates"
            icon="bell"
            rightElement={<Switch value={true} />}
          />
          <View style={styles.divider} />
          <SettingItem title="Security" subtitle="Password & privacy" icon="bolt" />
          <View style={styles.divider} />
          <SettingItem title="Preferences" subtitle="App settings" icon="bolt" />
        </Card>

        <Card style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusIconBg}>
              <Icon name="bolt" size={24} color={colors.white} />
            </View>
            <View style={styles.statusHeaderText}>
              <Text style={styles.statusTitle}>System Status</Text>
              <Text style={styles.statusSubtitle}>All systems operational</Text>
            </View>
          </View>
          <View style={styles.statusGrid}>
            <View style={styles.statusGridItem}>
              <Text style={styles.statusGridLabel}>Firmware</Text>
              <Text style={styles.statusGridValue}>v2.4.1</Text>
            </View>
            <View style={styles.statusGridItem}>
              <Text style={styles.statusGridLabel}>Last Update</Text>
              <Text style={styles.statusGridValue}>Mar 5, 2024</Text>
            </View>
          </View>
        </Card>

        <PrimaryButton
          title="Download Usage Report"
          onPress={() => {}}
          style={styles.reportBtn}
        />

        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Icon name="bolt" size={20} color={colors.error} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Smart Meter Monitor v1.0.0</Text>
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 32,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  avatarText: {
    fontSize: 28,
    color: colors.white,
    fontWeight: 'bold',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.success,
    borderWidth: 3,
    borderColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  userTier: {
    fontSize: 14,
    color: colors.primary,
    marginTop: 2,
    fontWeight: '600',
  },
  statusRow: {
    marginTop: 8,
  },
  activeStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  infoCard: {
    padding: 16,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  infoValue: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 56,
  },
  meterCard: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  meterInfoItem: {
    alignItems: 'center',
  },
  meterLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 8,
  },
  meterValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  connectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionText: {
    fontSize: 14,
    color: colors.success,
    fontWeight: '600',
    marginLeft: 4,
  },
  settingsCard: {
    padding: 4,
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  settingIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '600',
  },
  settingSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
  statusCard: {
    backgroundColor: colors.text,
    padding: 20,
    marginBottom: 32,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  statusSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  statusGrid: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 16,
  },
  statusGridItem: {
    flex: 1,
  },
  statusGridLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  statusGridValue: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '600',
    marginTop: 4,
  },
  reportBtn: {
    backgroundColor: colors.text,
    height: 56,
    borderRadius: 16,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 16,
  },
  signOutText: {
    fontSize: 16,
    color: colors.error,
    fontWeight: '600',
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 32,
    paddingBottom: 24,
  },
});