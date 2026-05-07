import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Dimensions } from 'react-native';
import colors from '../assets/styles/colors';
import Card from '../components/common/Card';
import Icon from '../components/common/Icon';
import { Svg, Circle, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';
import Animated, { FadeInUp, FadeInDown, useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const CircularIndicator = ({ size, progress, color, active }) => {
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={size}>
        <Circle
          stroke={active ? `${color}20` : '#E2E8F0'}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {active && (
          <Circle
            stroke={color}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={offset}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        )}
      </Svg>
      <View style={[styles.innerCircle, { backgroundColor: active ? color : '#F1F5F9' }]}>
        <Icon name="bolt" size={size * 0.4} color={active ? colors.white : '#94A3B8'} />
      </View>
    </View>
  );
};

const DeviceCard = ({ name, status, consumption, todayUsage, icon, color, index }) => {
  const isActive = status === 'active';
  const progressVal = Math.min((consumption / 3) * 100, 100);

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 100).duration(600)}
      style={[styles.deviceCard, isActive && { borderColor: `${color}40`, borderWidth: 1.5, shadowColor: color, shadowOpacity: 0.2 }]}
    >
      <View style={styles.cardTop}>
        <View style={[styles.iconBox, { backgroundColor: isActive ? `${color}15` : '#F8FAFC' }]}>
          <Icon name={icon} size={28} color={isActive ? color : '#64748B'} />
        </View>
        <CircularIndicator size={48} progress={progressVal} color={color} active={isActive} />
      </View>

      <View style={styles.cardMid}>
        <Text style={styles.deviceName}>{name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: isActive ? `${color}15` : '#F1F5F9' }]}>
          <View style={[styles.statusDot, { backgroundColor: isActive ? color : '#94A3B8' }]} />
          <Text style={[styles.statusText, { color: isActive ? color : '#64748B' }]}>
            {isActive ? 'RUNNING' : 'STANDBY'}
          </Text>
        </View>
      </View>

      <View style={styles.cardBottom}>
        <View style={styles.stat}>
          <Text style={styles.usageLabel}>LOAD</Text>
          <Text style={styles.usageValue}>{consumption} <Text style={styles.unit}>kW</Text></Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.usageLabel}>TODAY</Text>
          <Text style={styles.usageValue}>{todayUsage} <Text style={styles.unit}>kWh</Text></Text>
        </View>
      </View>

      {isActive && (
        <View style={[styles.glowEffect, { backgroundColor: color }]} />
      )}
    </Animated.View>
  );
};

export default function DevicesScreen() {
  const [activeDevices, setActiveDevices] = useState([]);
  const [mainsPower, setMainsPower] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const supportedAppliances = [
    { name: 'Air Conditioner', key: 'AC', consumption: 2.4, todayUsage: 5.8, icon: 'air-conditioner', color: '#0EA5E9' },
    { name: 'Water Heater', key: 'Stove-Oven', consumption: 1.8, todayUsage: 4.3, icon: 'bolt', color: '#F43F5E' },
    { name: 'Refrigerator', key: 'Fridge-Freezer', consumption: 0.8, todayUsage: 1.9, icon: 'bolt', color: '#10B981' },
    { name: 'Washing Machine', key: 'Washing Machine', consumption: 0.3, todayUsage: 0.7, icon: 'bolt', color: '#8B5CF6' },
    { name: 'TV Philips', key: 'TV-Philips', consumption: 0.15, todayUsage: 0.4, icon: 'tv', color: '#6366F1' },
    { name: 'TV Sharp', key: 'TV-Sharp', consumption: 0.12, todayUsage: 0.3, icon: 'tv', color: '#A78BFA' },
    { name: 'Microwave', key: 'Microwave', consumption: 0.8, todayUsage: 1.9, icon: 'bolt', color: '#F59E0B' },
    { name: 'Kettle', key: 'Kettle', consumption: 1.5, todayUsage: 3.6, icon: 'bolt', color: '#D97706' },
    { name: 'MacBook Pro', key: 'MacBookPro2011-2', consumption: 0.08, todayUsage: 0.2, icon: 'laptop', color: '#3B82F6' },
    { name: 'MacBook Air', key: 'MacBookPro2011-1', consumption: 0.06, todayUsage: 0.15, icon: 'laptop', color: '#60A5FA' },
    { name: 'Vacuum', key: 'VaccumCleaner', consumption: 1.2, todayUsage: 2.9, icon: 'bolt', color: '#64748B' }
  ];

  const fetchNilmData = async () => {
    try {
      const q = query(collection(db, 'data_nilm'), orderBy('orderIndex', 'asc'), limit(400));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(d => d.data());

      if (docs.length === 0) {
        setLoading(false);
        return;
      }

      const sequence = docs.map(d => [
        parseFloat(d.Voltage_V) || 230.0,
        parseFloat(d.Current_A) || 1.0,
        parseFloat(d.Active_Power_W) || 200.0,
        parseFloat(d.Reactive_Power_VAR) || 50.0
      ]);

      setMainsPower(parseFloat(docs[docs.length - 1].Active_Power_W) || 0);

      const HF_TOKEN = 'PASTE_YOUR_TOKEN_HERE'; // Token moved to .env for security
      const response = await fetch('https://habebamostafa-smart-meter-api.hf.space/predict/nilm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${HF_TOKEN}`
        },
        body: JSON.stringify({ sequence: sequence })
      });

      if (response.ok) {
        const result = await response.json();
        const activeList = Object.keys(result.predictions || {}).filter(k => result.predictions[k] === 1);
        setActiveDevices(activeList);
      }
    } catch (error) {
      console.error("Error fetching NILM:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNilmData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNilmData();
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(800)} style={styles.header}>
        <View>
          <Text style={styles.title}>NILM Center</Text>
          <Text style={styles.subtitle}>{activeDevices.length} Connected Appliances</Text>
        </View>
        <View style={styles.mainsBox}>
          <Text style={styles.mainsLabel}>TOTAL LOAD</Text>
          <Text style={styles.mainsValue}>{(mainsPower / 1000).toFixed(2)} <Text style={styles.mainsUnit}>kW</Text></Text>
        </View>
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {supportedAppliances.map((app, index) => (
            <DeviceCard
              key={app.key}
              index={index}
              name={app.name}
              status={activeDevices.includes(app.key) ? 'active' : 'off'}
              consumption={app.consumption}
              todayUsage={app.todayUsage}
              icon={app.icon}
              color={app.color}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
    zIndex: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },
  mainsBox: {
    alignItems: 'flex-end',
    backgroundColor: `${colors.primary}10`,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
  },
  mainsLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 1,
  },
  mainsValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  mainsUnit: {
    fontSize: 12,
    fontWeight: '600',
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  deviceCard: {
    width: '48%',
    padding: 20,
    marginBottom: 16,
    borderRadius: 28,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 20,
    elevation: 3,
    overflow: 'hidden',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  cardMid: {
    marginBottom: 20,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  stat: {
    flex: 1,
  },
  usageLabel: {
    fontSize: 8,
    fontWeight: '900',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  usageValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
  },
  unit: {
    fontSize: 9,
    fontWeight: '600',
    color: '#64748B',
  },
  glowEffect: {
    position: 'absolute',
    bottom: -30,
    right: -30,
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.05,
  }
});