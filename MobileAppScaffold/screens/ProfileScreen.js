import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import SecondaryButton from '../components/buttons/SecondaryButton';
import colors from '../utils/colors';
import font from '../assets/fonts/font';

const ProfileScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>Account & settings</Text>
      
      <View style={styles.profileHeader}>
        <View style={styles.avatar}><Text style={styles.avatarText}>JD</Text></View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>John Doe</Text>
          <Text style={styles.profileType}>Premium Member</Text>
          <Text style={styles.profileStatus}>✓ Verified Active</Text>
        </View>
      </View>
      
      <Text style={styles.sectionTitle}>Contact Information</Text>
      <View style={styles.listCard}>
        <InfoItem label="Email" value="john.doe@example.com" />
        <InfoItem label="Phone" value="+1 (555) 123-4567" />
        <InfoItem label="Address" value="123 Smart St, Tech City" />
      </View>
      
      <Text style={styles.sectionTitle}>Smart Meter</Text>
      <View style={styles.listCard}>
        <InfoItem label="Meter ID" value="SM-2024-0012" />
        <InfoItem label="Installed" value="Jan 15, 2024" />
        <InfoItem label="Calibrated" value="Mar 1, 2024" />
        <InfoItem label="Connection" value="PLC + RF" />
      </View>
      
      <Text style={styles.sectionTitle}>Settings</Text>
      <View style={styles.listCard}>
        <InfoItem label="Notifications" value="Alerts & updates" />
        <InfoItem label="Security" value="Password & privacy" />
        <InfoItem label="Preferences" value="App settings" />
      </View>
      
      <View style={styles.systemStatusCard}>
        <Text style={styles.boldText}>System Status</Text>
        <Text style={styles.mutedText}>All systems operational</Text>
        <View style={styles.versionRow}>
          <Text style={styles.mutedText}>Firmware</Text>
          <Text style={styles.mutedText}>v2.4.1</Text>
        </View>
      </View>
      
      <SecondaryButton title="Download Report" onPress={() => {}} style={{ marginBottom: 12 }} />
      <SecondaryButton title="Sign Out" onPress={() => {}} />
      <Text style={styles.footerText}>Smart Meter Monitor v1.0.0</Text>
    </ScrollView>
  );
};

const InfoItem = ({ label, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  title: { ...font.title, color: colors.text, marginTop: 40 },
  subtitle: { ...font.regular, color: colors.muted, marginBottom: 20 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border, marginBottom: 24 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.text, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  avatarText: { color: colors.surface, ...font.title },
  profileInfo: { flex: 1 },
  profileName: { ...font.header, color: colors.text },
  profileType: { ...font.regular, color: colors.muted, marginTop: 4 },
  profileStatus: { ...font.regular, color: colors.primary, marginTop: 4 },
  sectionTitle: { ...font.header, color: colors.text, marginBottom: 12, marginTop: 8 },
  listCard: { backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, marginBottom: 24 },
  infoItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  infoLabel: { ...font.regular, color: colors.text },
  infoValue: { ...font.regular, color: colors.muted },
  systemStatusCard: { backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 16, marginBottom: 24 },
  boldText: { ...font.bold, color: colors.text },
  mutedText: { ...font.regular, color: colors.muted, marginTop: 4 },
  versionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border },
  footerText: { ...font.regular, color: colors.muted, textAlign: 'center', marginTop: 24, marginBottom: 40 },
});

export default ProfileScreen;
