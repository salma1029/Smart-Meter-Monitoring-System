import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import colors from '../utils/colors';
import Card from '../components/common/Card';
import Icon from '../components/common/Icon';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';

const AlertItem = ({ title, description, time, type, index }) => {
  const isCritical = type === 'CRITICAL';
  const color = isCritical ? colors.error : colors.secondary;

  return (
    <Animated.View entering={FadeInRight.delay(index * 100).duration(600)}>
      <Card style={[styles.alertCard, isCritical && styles.criticalBorder]}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
          <Icon name="alert-triangle" size={24} color={color} />
        </View>
        <View style={styles.alertContent}>
          <View style={styles.alertHeader}>
            <Text style={[styles.alertTitle, { color: isCritical ? colors.error : '#1E293B' }]}>{title}</Text>
            <Text style={styles.alertTime}>{time}</Text>
          </View>
          <Text style={styles.alertDescription}>{description}</Text>
          <View style={[styles.typeBadge, { backgroundColor: `${color}10` }]}>
             <Text style={[styles.typeText, { color: color }]}>{type}</Text>
          </View>
        </View>
      </Card>
    </Animated.View>
  );
};

export default function AlertsScreen() {
  const alerts = [
    { id: 1, title: 'Unusual Spike', description: 'A sudden 2.4kW jump was detected from the Air Conditioner line.', time: '10:45 AM', type: 'CRITICAL' },
    { id: 2, title: 'Efficiency Milestone', description: 'Your energy usage is 15% lower this week compared to last month.', time: '09:00 AM', type: 'INFO' },
    { id: 3, title: 'High Load Alert', description: 'Total consumption is approaching your daily limit of 25kWh.', time: 'Yesterday', type: 'CRITICAL' },
    { id: 4, title: 'System Updated', description: 'NILM Model V2.4 successfully deployed to your smart gateway.', time: '2 days ago', type: 'INFO' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.duration(800)} style={styles.header}>
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subtitle}>Recent system events and AI alerts</Text>
        </Animated.View>

        {alerts.map((alert, index) => (
          <AlertItem key={alert.id} index={index} {...alert} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 6,
    fontWeight: '500',
  },
  alertCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 15,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  criticalBorder: {
    borderColor: `${colors.error}20`,
    backgroundColor: `${colors.error}02`,
  },
  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 18,
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
    marginBottom: 6,
  },
  alertTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  alertTime: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  alertDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 12,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  }
});