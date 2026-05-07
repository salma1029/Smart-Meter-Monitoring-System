import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/common/Card';
import Icon from '../components/common/Icon';
import { db, auth } from '../utils/firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';

const AlertItem = ({ title, description, timestamp, type, index, theme }) => {
  const isCritical = type === 'CRITICAL';
  const color = isCritical ? theme.error : theme.secondary;
  
  const dateStr = timestamp?.toDate ? timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now';

  return (
    <Animated.View entering={FadeInRight.delay(index * 100).duration(600)}>
      <Card style={[styles.alertCard, { backgroundColor: theme.card, borderColor: theme.border }, isCritical && { borderColor: `${theme.error}40`, backgroundColor: `${theme.error}05` }]}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
          <Icon name="alert-triangle" size={24} color={color} />
        </View>
        <View style={styles.alertContent}>
          <View style={styles.alertHeader}>
            <Text style={[styles.alertTitle, { color: isCritical ? theme.error : theme.text }]}>{title}</Text>
            <Text style={[styles.alertTime, { color: theme.textMuted }]}>{dateStr}</Text>
          </View>
          <Text style={[styles.alertDescription, { color: theme.textMuted }]}>{description}</Text>
          <View style={[styles.typeBadge, { backgroundColor: `${color}10` }]}>
            <Text style={[styles.typeText, { color: color }]}>{type}</Text>
          </View>
        </View>
      </Card>
    </Animated.View>
  );
};

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const q = query(
          collection(db, 'alerts'),
          where('userId', '==', user.uid)
        );

        const unsubscribeSnap = onSnapshot(q, (snapshot) => {
          const alertList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          alertList.sort((a, b) => {
            const timeA = a.timestamp?.seconds || (a.timestamp?.toDate ? a.timestamp.toDate().getTime() / 1000 : 0);
            const timeB = b.timestamp?.seconds || (b.timestamp?.toDate ? b.timestamp.toDate().getTime() / 1000 : 0);
            return timeB - timeA;
          });
          
          setAlerts(alertList);
          setLoading(false);
        }, (error) => {
          console.error("Firestore error:", error);
          setLoading(false);
        });

        return () => unsubscribeSnap();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.duration(800)} style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>System Alerts</Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>Real-time AI monitoring logs</Text>
        </Animated.View>

        {loading ? (
          <View style={{ marginTop: 50 }}>
            <ActivityIndicator color={theme.primary} size="large" />
          </View>
        ) : alerts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="bolt" size={60} color={theme.border} />
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>No alerts found. Everything looks stable!</Text>
          </View>
        ) : (
          alerts.map((alert, index) => (
            <AlertItem key={alert.id} index={index} {...alert} theme={theme} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: 24, paddingTop: 60 },
  header: { marginBottom: 32 },
  title: { fontSize: 32, fontWeight: '800', letterSpacing: -1 },
  subtitle: { fontSize: 15, marginTop: 6, fontWeight: '500' },
  alertCard: { flexDirection: 'row', padding: 20, borderRadius: 24, marginBottom: 16, elevation: 3, borderWidth: 1 },
  iconContainer: { width: 54, height: 54, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  alertContent: { flex: 1 },
  alertHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  alertTitle: { fontSize: 17, fontWeight: '700' },
  alertTime: { fontSize: 11, fontWeight: '600' },
  alertDescription: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
  typeBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  typeText: { fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 20, fontSize: 16, fontWeight: '500', textAlign: 'center', paddingHorizontal: 40 }
});