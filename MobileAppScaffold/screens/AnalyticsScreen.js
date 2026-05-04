import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import colors from '../utils/colors';
import Card from '../components/common/Card';
import Icon from '../components/common/Icon';
import { Svg, Path, Defs, LinearGradient, Stop, Rect, G } from 'react-native-svg';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';
import Animated, { FadeInUp, FadeInDown, useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const StatBox = ({ label, value, icon, color, index }) => (
  <Animated.View entering={FadeInUp.delay(index * 150).duration(800)} style={styles.statBox}>
    <Card style={styles.statCard}>
      <View style={[styles.statIconBg, { backgroundColor: `${color}15` }]}>
        <Icon name={icon} size={22} color={color} />
      </View>
      <View style={styles.statBoxContent}>
        <Text style={styles.statBoxLabel}>{label}</Text>
        <Text style={styles.statBoxValue}>{value}</Text>
      </View>
    </Card>
  </Animated.View>
);

export default function AnalyticsScreen() {
  const [timeRange, setTimeRange] = useState('Week');
  const ranges = ['Day', 'Week', 'Month'];
  const [forecastVal, setForecastVal] = useState('0.00');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForecast(timeRange);
  }, [timeRange]);

  const fetchForecast = async (range) => {
    setLoading(true);
    try {
      const q = query(collection(db, 'data_forecast'), limit(10));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(d => d.data());
      
      if (docs.length === 0) {
        setLoading(false);
        return;
      }
      
      const sequence = [];
      for (let i = 0; i < 168; i++) {
        const doc = docs[i % docs.length];
        sequence.push([
          parseFloat(doc.meter_reading || doc.USAGE || 117.2),
          0, 1, 4, 1, 53, 1, 0, 0, 195.4, 67.7, 0
        ]);
      }

      const HF_TOKEN = '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';
      const response = await fetch('https://habebamostafa-smart-meter-api.hf.space/predict/forecast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${HF_TOKEN}`
        },
        body: JSON.stringify({ sequence: sequence })
      });

      if (response.ok) {
        const result = await response.json();
        let val = Array.isArray(result.forecast) ? result.forecast[0] : result.forecast;
        
        if (range === 'Day') val = val / 7;
        if (range === 'Month') val = val * 4.3;

        if(val !== undefined) {
           setForecastVal(parseFloat(val).toFixed(2));
        }
      }
    } catch (error) {
      console.error("Error fetching forecast:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(800)} style={styles.header}>
          <Text style={styles.title}>Energy Insights</Text>
          <Text style={styles.subtitle}>Analyzing patterns & forecasting demand</Text>
        </Animated.View>

        <View style={styles.statsRow}>
          <StatBox index={0} label="Peak Power" value="3.42 kW" icon="bolt" color="#F43F5E" />
          <StatBox index={1} label="Efficiency" value="89%" icon="bolt" color="#10B981" />
        </View>

        <Animated.View entering={FadeInUp.delay(300).duration(800)} style={styles.rangeSelector}>
          {ranges.map(r => (
            <TouchableOpacity
              key={r}
              style={[styles.rangeBtn, timeRange === r && styles.activeRangeBtn]}
              onPress={() => setTimeRange(r)}
            >
              <Text style={[styles.rangeText, timeRange === r && styles.activeRangeText]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(450).duration(800)}>
          <Card style={styles.chartCard}>
            <LinearGradient
              colors={['#0F172A', '#1E293B']}
              style={styles.cardInternal}
            >
              <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>Consumption Wave</Text>
                <View style={styles.liveTag}>
                   <View style={styles.liveDot} />
                   <Text style={styles.liveTagText}>AI GENERATED</Text>
                </View>
              </View>
              
              <View style={styles.chartContainer}>
                <Svg height="180" width="100%" viewBox="0 0 300 180">
                  <Defs>
                    <LinearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <Stop offset="0" stopColor={colors.secondary} stopOpacity="0.5" />
                      <Stop offset="1" stopColor={colors.secondary} stopOpacity="0" />
                    </LinearGradient>
                  </Defs>
                  <Path
                    d="M0,150 Q30,120 60,135 T120,90 T180,110 T240,70 T300,95 L300,180 L0,180 Z"
                    fill="url(#chartGrad)"
                  />
                  <Path
                    d="M0,150 Q30,120 60,135 T120,90 T180,110 T240,70 T300,95"
                    fill="none"
                    stroke={colors.secondary}
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </Svg>
              </View>
              
              <View style={styles.chartLegend}>
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                  <Text key={d} style={styles.legendText}>{d}</Text>
                ))}
              </View>
            </LinearGradient>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(600).duration(800)}>
          <Card style={styles.forecastCard}>
            <View style={styles.forecastHeader}>
              <View style={styles.forecastIconBg}>
                 <Icon name="cpu" size={26} color={colors.white} />
              </View>
              <View>
                <Text style={styles.forecastTitle}>AI Forecast Engine</Text>
                <Text style={styles.forecastSubtitle}>Projected usage for the next {timeRange.toLowerCase()}</Text>
              </View>
            </View>
            
            <View style={styles.divider} />

            <View style={styles.forecastBody}>
              <View style={styles.forecastMain}>
                 <Text style={styles.mainLabel}>Expected Consumption</Text>
                 {loading ? (
                   <ActivityIndicator size="small" color={colors.primary} />
                 ) : (
                   <View style={styles.valueRow}>
                      <Text style={styles.mainValue}>{forecastVal}</Text>
                      <Text style={styles.mainUnit}>kWh</Text>
                   </View>
                 )}
              </View>
              <View style={styles.forecastMeta}>
                 <View style={styles.metaBadge}>
                    <Text style={styles.metaLabel}>Confidence</Text>
                    <Text style={styles.metaValue}>96.4%</Text>
                 </View>
              </View>
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
    marginBottom: 32,
    marginTop: 20,
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statBox: {
    width: '48%',
  },
  statCard: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 15,
    elevation: 2,
  },
  statIconBg: {
    width: 46,
    height: 46,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statBoxContent: {
    flex: 1,
  },
  statBoxLabel: {
    fontSize: 10,
    color: '#94A3B8',
    textTransform: 'uppercase',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statBoxValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 2,
  },
  rangeSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 20,
    padding: 6,
    marginBottom: 32,
  },
  rangeBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 16,
  },
  activeRangeBtn: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  rangeText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  activeRangeText: {
    color: colors.primary,
    fontWeight: '800',
  },
  chartCard: {
    padding: 0,
    overflow: 'hidden',
    borderRadius: 32,
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#0F172A',
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  cardInternal: {
    padding: 24,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.white,
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondary,
    marginRight: 6,
  },
  liveTagText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '900',
  },
  chartContainer: {
    height: 180,
    marginBottom: 16,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  legendText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '800',
  },
  forecastCard: {
    padding: 24,
    borderRadius: 32,
    backgroundColor: colors.white,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
  },
  forecastHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  forecastIconBg: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  forecastTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
  },
  forecastSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 20,
  },
  forecastBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forecastMain: {
    flex: 1,
  },
  mainLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 6,
    fontWeight: '600',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  mainValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1E293B',
  },
  mainUnit: {
    fontSize: 16,
    color: '#64748B',
    marginLeft: 6,
    marginBottom: 6,
    fontWeight: '700',
  },
  forecastMeta: {
    alignItems: 'flex-end',
  },
  metaBadge: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  metaLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '800',
  },
  metaValue: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
  }
});