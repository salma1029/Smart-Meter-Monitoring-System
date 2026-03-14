import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import colors from '../utils/colors';
import font from '../assets/fonts/font';

const DevicesScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Devices</Text>
      <Text style={styles.subtitle}>NILM Detection System</Text>
      
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.mutedText}>Active</Text>
          <Text style={styles.summaryValue}>4</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.mutedText}>Total Load</Text>
          <Text style={styles.summaryValue}>5.2 kW</Text>
        </View>
      </View>
      
      <View style={styles.tabsRow}>
        <Text style={[styles.tab, styles.activeTab]}>All</Text>
        <Text style={styles.tab}>Active</Text>
        <Text style={styles.tab}>Standby</Text>
        <Text style={styles.tab}>Off</Text>
      </View>
      
      <View style={styles.listCard}>
        <DeviceItem name="Air Conditioner" status="ACTIVE" power="2.4 kW" consumption="18.5 kWh today" percent="12%" />
        <DeviceItem name="Water Heater" status="ACTIVE" power="1.8 kW" consumption="12.3 kWh today" percent="5%" />
        <DeviceItem name="Refrigerator" status="ACTIVE" power="0.8 kW" consumption="9.2 kWh today" percent="3%" />
        <DeviceItem name="Washing Machine" status="IDLE" power="0.3 kW" consumption="2.4 kWh today" percent="8%" />
        <DeviceItem name="TV" status="ACTIVE" power="0.15 kW" consumption="3.6 kWh today" percent="2%" />
        <DeviceItem name="Microwave" status="OFF" power="Off" consumption="0.8 kWh today" percent="15%" />
      </View>
    </ScrollView>
  );
};

const DeviceItem = ({ name, status, power, consumption, percent }) => (
  <View style={styles.deviceItem}>
    <View style={styles.deviceHeader}>
      <Text style={styles.deviceName}>{name}</Text>
      <Text style={styles.deviceStatus}>{status}</Text>
    </View>
    <View style={styles.deviceDetails}>
      <Text style={styles.devicePower}>{power}</Text>
      <Text style={styles.dot}> • </Text>
      <Text style={styles.deviceConsumption}>{consumption}</Text>
    </View>
    <View style={styles.progressRow}>
      <View style={styles.progressBar}><View style={[styles.progressFill, { width: percent }]} /></View>
      <Text style={styles.percentText}>{percent}</Text>
    </View>
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
  tabsRow: { flexDirection: 'row', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 8 },
  tab: { ...font.regular, color: colors.muted, marginRight: 24, paddingBottom: 8 },
  activeTab: { color: colors.primary, fontWeight: 'bold', borderBottomWidth: 2, borderBottomColor: colors.primary },
  listCard: { backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  deviceItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  deviceHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  deviceName: { ...font.bold, color: colors.text },
  deviceStatus: { ...font.regular, color: colors.primary, fontSize: 12 },
  deviceDetails: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  devicePower: { ...font.regular, color: colors.text },
  dot: { color: colors.muted },
  deviceConsumption: { ...font.regular, color: colors.muted },
  progressRow: { flexDirection: 'row', alignItems: 'center' },
  progressBar: { flex: 1, height: 4, backgroundColor: colors.border, borderRadius: 2, marginRight: 8 },
  progressFill: { height: 4, backgroundColor: colors.primary, borderRadius: 2 },
  percentText: { ...font.regular, color: colors.muted, fontSize: 12 },
});

export default DevicesScreen;
