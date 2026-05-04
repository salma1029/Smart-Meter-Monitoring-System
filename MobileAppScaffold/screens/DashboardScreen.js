import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import colors from '../utils/colors';
import Card from '../components/common/Card';
import Icon from '../components/common/Icon';
import { Svg, Circle, Defs, LinearGradient, Stop, Rect, Path } from 'react-native-svg';
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';
import { db, auth } from '../utils/firebaseConfig';
import Animated, { FadeInUp, FadeInRight, useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const CircularProgress = ({ size, strokeWidth, progress, color, icon }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={size}>
        <Circle
          stroke="#E2E8F0"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
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
      </Svg>
      <View style={styles.circularIcon}>
        <Icon name={icon} size={size * 0.45} color={color} />
      </View>
    </View>
  );
};

const ConsumerItem = ({ name, value, percentage, icon, color, index }) => (
  <Animated.View 
    entering={FadeInRight.delay(index * 100).duration(600)}
    style={styles.consumerItem}
  >
    <CircularProgress size={74} strokeWidth={6} progress={percentage} color={color} icon={icon} />
    <View style={styles.consumerInfo}>
      <Text style={styles.consumerName}>{name}</Text>
      <Text style={styles.consumerValue}>{value} <Text style={{fontSize: 10, color: colors.textMuted}}>kW</Text> • {percentage}%</Text>
    </View>
    <View style={[styles.consumerTrend, { backgroundColor: `${color}10` }]}>
       <Icon name="trending-up" size={14} color={color} />
    </View>
  </Animated.View>
);

const PulseDot = () => {
  const opacity = useSharedValue(1);
  useEffect(() => {
    opacity.value = withRepeat(withSequence(withTiming(0.4, { duration: 800 }), withTiming(1, { duration: 800 })), -1);
  }, []);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={[styles.liveDot, animatedStyle]} />;
};

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [livePower, setLivePower] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [activeList, setActiveList] = useState([]);
  const [lastAlert, setLastAlert] = useState(null);
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const user = auth.currentUser;
    if (user && user.displayName) {
      setUserName(user.displayName.split(' ')[0]);
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const q = query(collection(db, 'data_nilm'), orderBy('orderIndex', 'asc'), limit(400));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(d => d.data());

      if (docs.length > 0) {
        const latestDoc = docs[docs.length - 1];
        setLivePower(latestDoc.Active_Power_W || 0);

        const sequence = docs.map(d => [
          parseFloat(d.Voltage_V) || 230.0,
          parseFloat(d.Current_A) || 1.0,
          parseFloat(d.Active_Power_W) || 200.0,
          parseFloat(d.Reactive_Power_VAR) || 50.0
        ]);

        const HF_TOKEN = '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';
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
          const predictions = result.predictions || {};
          const active = Object.keys(predictions).filter(k => predictions[k] === 1);
          setActiveCount(active.length);
          setActiveList(active);

          const latest = docs[docs.length - 1];
          const now = new Date();
          const anomalyData = [{
            'meter_reading': parseFloat(latest.Active_Power_W) || 0,
            'hour': now.getHours(),
            'day': now.getDate(),
            'day_of_week': now.getDay(),
            'day_of_year': 124,
            'week_of_year': 18,
            'month': now.getMonth() + 1,
            'is_weekend': now.getDay() === 0 || now.getDay() === 6 ? 1 : 0,
            'usage_change': 0.05,
            'rolling_mean_3': parseFloat(latest.Active_Power_W) || 0,
            'rolling_std_3': 1.2,
            'usage_diff_3h': 0.1
          }];

          const anomalyResp = await fetch('https://habebamostafa-smart-meter-api.hf.space/predict/anomaly', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${HF_TOKEN}` },
            body: JSON.stringify({ data: anomalyData })
          });
          
          if (anomalyResp.ok) {
            const anomalyResult = await anomalyResp.json();
            if (anomalyResult.predictions && anomalyResult.predictions[0] === 1) {
              setLastAlert({
                title: 'Unusual Spike',
                description: 'We detected a significant power surge. Check your appliances.',
                type: 'CRITICAL',
                time: 'Just now'
              });
            }
          }
        }
      }
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  const applianceMapping = {
    'TV-Philips': { name: 'TV Philips', icon: 'tv', color: '#8B5CF6' },
    'TV-Sharp': { name: 'TV Sharp', icon: 'tv', color: '#A78BFA' },
    'MacBookPro2011-2': { name: 'MacBook Pro', icon: 'laptop', color: '#3B82F6' },
    'MacBookPro2011-1': { name: 'MacBook Air', icon: 'laptop', color: '#60A5FA' },
    'Fridge-Freezer': { name: 'Fridge', icon: 'bolt', color: '#10B981' },
    'Kettle': { name: 'Kettle', icon: 'bolt', color: '#F59E0B' },
    'Washing Machine': { name: 'Washing Machine', icon: 'bolt', color: '#EC4899' },
    'Microwave': { name: 'Microwave', icon: 'bolt', color: '#F97316' },
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.duration(800)} style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome, {userName}</Text>
            <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
             <Icon name="bell" size={24} color={colors.text} />
             {activeCount > 0 && <View style={styles.badge} />}
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(800)}>
          <Card style={styles.mainCard}>
             <Svg height="200" width="100%" style={StyleSheet.absoluteFill}>
                <Defs>
                  <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor="#0D9488" />
                    <Stop offset="1" stopColor="#3B82F6" />
                  </LinearGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#grad)" rx="24" />
                <Path d="M0 100 Q 50 80, 100 120 T 200 90 T 300 130 T 400 100 V 200 H 0 Z" fill="rgba(255,255,255,0.05)" />
             </Svg>
             <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                   <View style={styles.liveBadge}>
                      <PulseDot />
                      <Text style={styles.liveText}>LIVE MONITORING</Text>
                   </View>
                   <Text style={styles.statusText}>{activeCount} Active Devices</Text>
                </View>
                
                <View style={styles.powerRow}>
                   <Text style={styles.powerValue}>{(livePower / 1000).toFixed(2)}</Text>
                   <Text style={styles.powerUnit}>kW</Text>
                </View>
                <Text style={styles.powerLabel}>Real-time Power Load</Text>
                
                <View style={styles.cardDivider} />
                <View style={styles.cardFooter}>
                   <Icon name="trending-down" size={16} color="rgba(255,255,255,0.7)" />
                   <Text style={styles.footerText}>8.4% lower than usual today</Text>
                </View>
             </View>
          </Card>
        </Animated.View>

        <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>Energy Consumers</Text>
           <TouchableOpacity onPress={fetchDashboardData}>
              <Icon name="refresh-cw" size={18} color={colors.primary} />
           </TouchableOpacity>
        </View>

        <Card style={styles.listCard}>
           {activeList.length > 0 ? (
             activeList.map((key, index) => {
               const app = applianceMapping[key] || { name: key, icon: 'bolt', color: colors.primary };
               return (
                 <ConsumerItem 
                   key={key}
                   index={index}
                   name={app.name}
                   value={(livePower / 1000 / activeList.length).toFixed(2)}
                   percentage={Math.floor(100 / activeList.length)}
                   icon={app.icon}
                   color={app.color}
                 />
               );
             })
           ) : loading ? (
             <ActivityIndicator size="small" color={colors.primary} style={{margin: 20}} />
           ) : (
             <Text style={styles.emptyText}>No major activity detected.</Text>
           )}
        </Card>

        <Text style={styles.sectionTitle}>System Status</Text>
        <Animated.View entering={FadeInUp.delay(400).duration(800)}>
          <Card style={[styles.statusCard, lastAlert?.type === 'CRITICAL' && styles.criticalCard]}>
             <View style={[styles.statusIconBg, { backgroundColor: lastAlert?.type === 'CRITICAL' ? `${colors.error}15` : `${colors.success}15` }]}>
                <Icon name="alert-triangle" size={24} color={lastAlert?.type === 'CRITICAL' ? colors.error : colors.success} />
             </View>
             <View style={styles.statusContent}>
                <Text style={styles.statusTitle}>{lastAlert ? lastAlert.title : 'Optimal Performance'}</Text>
                <Text style={styles.statusDesc}>{lastAlert ? lastAlert.description : 'Your smart meter is reporting high efficiency today.'}</Text>
             </View>
          </Card>
        </Animated.View>
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
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
    marginTop: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  date: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },
  notifBtn: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  badge: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    borderWidth: 2,
    borderColor: colors.white,
  },
  mainCard: {
    height: 200,
    borderRadius: 24,
    padding: 0,
    overflow: 'hidden',
    marginBottom: 32,
    borderWidth: 0,
    elevation: 10,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  cardContent: {
    padding: 24,
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34D399',
    marginRight: 6,
  },
  liveText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  statusText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontWeight: '600',
  },
  powerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  powerValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.white,
  },
  powerUnit: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.7)',
    marginLeft: 6,
    marginBottom: 8,
    fontWeight: '600',
  },
  powerLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginTop: -4,
    marginBottom: 16,
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 12,
  },
  footerText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    marginLeft: 8,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  listCard: {
    padding: 16,
    borderRadius: 24,
    marginBottom: 32,
  },
  consumerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  circularIcon: {
    position: 'absolute',
  },
  consumerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  consumerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  consumerValue: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  consumerTrend: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 24,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  criticalCard: {
    borderWidth: 1,
    borderColor: `${colors.error}30`,
  },
  statusIconBg: {
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  statusDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  emptyText: {
    textAlign: 'center',
    color: '#94A3B8',
    padding: 20,
  }
});