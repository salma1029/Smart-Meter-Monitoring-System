import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import colors from '../utils/colors';
import font from '../assets/fonts/font';

const AlertsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Alerts</Text>
      <Text style={styles.subtitle}>AI-powered anomaly detection</Text>
      
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.mutedText}>Critical</Text>
          <Text style={styles.summaryValue}>1</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.mutedText}>Resolved</Text>
          <Text style={styles.summaryValue}>1</Text>
        </View>
      </View>
      
      <Text style={styles.sectionTitle}>Active Alerts</Text>
      <View style={styles.listCard}>
        <AlertItem 
          title="Power Spike Detected" 
          type="CRITICAL" 
          desc="Unusual power surge detected in the main circuit" 
          time="10 mins ago" 
          location="Main Panel" 
        />
        <AlertItem 
          title="High Power Usage" 
          type="WARNING" 
          desc="AC running continuously for 6 hours" 
          time="2 hours ago" 
          location="Living Room" 
        />
        <AlertItem 
          title="Appliance Malfunction" 
          type="WARNING" 
          desc="Refrigerator showing abnormal power consumption" 
          time="5 hours ago" 
          location="Kitchen" 
        />
      </View>
      
      <Text style={styles.sectionTitle}>Recently Resolved</Text>
      <View style={styles.listCard}>
        <AlertItem 
          title="Energy Efficiency Alert" 
          type="RESOLVED" 
          desc="Standby power consumption is higher than usual" 
          time="1 day ago" 
          resolved
        />
      </View>
      
      <View style={[styles.listCard, { marginTop: 24, padding: 16, backgroundColor: colors.text }]}>
        <Text style={[styles.boldText, { color: colors.surface }]}>Alert Settings</Text>
        <Text style={{ color: colors.muted, marginTop: 4 }}>Customize your notification preferences</Text>
      </View>
    </ScrollView>
  );
};

const AlertItem = ({ title, type, desc, time, location, resolved }) => (
  <View style={[styles.alertItem, resolved && styles.resolvedItem]}>
    <View style={styles.alertHeader}>
      <Text style={styles.alertTitle}>{title}</Text>
      <Text style={[styles.alertType, type === 'CRITICAL' && { color: 'red' }]}>{type}</Text>
    </View>
    <Text style={styles.alertDesc}>{desc}</Text>
    <View style={styles.alertDetails}>
      <Text style={styles.alertTime}>{time}</Text>
      {location && <Text style={styles.alertLocation}> • {location}</Text>}
    </View>
    {!resolved && (
      <View style={styles.actionsRow}>
        <Text style={styles.actionText}>Details</Text>
        <Text style={styles.actionText}>Resolve</Text>
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  title: { ...font.title, color: colors.text, marginTop: 40 },
  subtitle: { ...font.regular, color: colors.muted, marginBottom: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  summaryCard: { flex: 1, backgroundColor: colors.surface, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border, marginHorizontal: 4 },
  mutedText: { ...font.regular, color: colors.muted, marginBottom: 8 },
  summaryValue: { fontSize: 24, fontWeight: 'bold', color: colors.text },
  sectionTitle: { ...font.header, color: colors.text, marginBottom: 12, marginTop: 8 },
  listCard: { backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  alertItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  resolvedItem: { opacity: 0.6 },
  alertHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  alertTitle: { ...font.bold, color: colors.text },
  alertType: { ...font.regular, fontSize: 12, fontWeight: 'bold' },
  alertDesc: { ...font.regular, color: colors.text, marginBottom: 8 },
  alertDetails: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  alertTime: { ...font.regular, color: colors.muted, fontSize: 12 },
  alertLocation: { ...font.regular, color: colors.muted, fontSize: 12 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 },
  actionText: { ...font.bold, color: colors.text },
  boldText: { ...font.bold, color: colors.text },
});

export default AlertsScreen;
