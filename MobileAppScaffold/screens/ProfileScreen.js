import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import colors from '../assets/styles/colors';
import Card from '../components/common/Card';
import Icon from '../components/common/Icon';
import { auth, db } from '../utils/firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Animated, { FadeInUp, FadeInDown, FadeInRight } from 'react-native-reanimated';
import { Svg, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const InfoRow = ({ icon, label, value, color, index }) => (
  <Animated.View entering={FadeInRight.delay(index * 100).duration(600)} style={styles.infoRow}>
    <View style={[styles.infoIconBg, { backgroundColor: `${color}15` }]}>
      <Icon name={icon} size={20} color={color} />
    </View>
    <View style={styles.infoText}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || 'Not provided'}</Text>
    </View>
  </Animated.View>
);

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(auth.currentUser);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    if (!user) return;
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfileData(docSnap.data());
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(800)} style={styles.profileHeader}>
          <View style={styles.avatarWrapper}>
            <Svg height="120" width="120" style={styles.avatarSvg}>
              <Defs>
                <LinearGradient id="avatarGrad" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0" stopColor={colors.primary} />
                  <Stop offset="1" stopColor={colors.secondary} />
                </LinearGradient>
              </Defs>
              <Circle cx="60" cy="60" r="58" stroke="url(#avatarGrad)" strokeWidth="3" fill="none" strokeDasharray="10 5" />
            </Svg>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarInitial}>{user?.displayName ? user.displayName[0] : 'U'}</Text>
            </View>
          </View>

          <Text style={styles.userName}>{user?.displayName || 'Smart User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@smartmeter.com'}</Text>
        </Animated.View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Utility Information</Text>
          <Card style={styles.infoCard}>
            {loading ? (
              <ActivityIndicator color={colors.primary} style={{ padding: 20 }} />
            ) : (
              <>
                <InfoRow
                  index={0}
                  icon="bell"
                  label="Phone Number"
                  value={profileData?.phone}
                  color={colors.primary}
                />
                <View style={styles.divider} />
                <InfoRow
                  index={1}
                  icon="cpu"
                  label="Smart Meter ID"
                  value={profileData?.meterId}
                  color={colors.secondary}
                />
                <View style={styles.divider} />
                <InfoRow
                  index={2}
                  icon="home"
                  label="Installation Address"
                  value={profileData?.address}
                  color="#10B981"
                />
              </>
            )}
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <View style={styles.logoutIconBg}>
              <Icon name="arrow-left" size={20} color={colors.error} />
            </View>
            <Text style={styles.logoutText}>Sign Out of System</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>Smart Meter System v2.4.0</Text>
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
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarWrapper: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarSvg: {
    position: 'absolute',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  avatarInitial: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.white,
  },
  userName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  userEmail: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
    marginLeft: 4,
  },
  infoCard: {
    padding: 12,
    borderRadius: 28,
    backgroundColor: colors.white,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  infoIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: '#94A3B8',
    textTransform: 'uppercase',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 16,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: `${colors.error}08`,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: `${colors.error}15`,
  },
  logoutIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: `${colors.error}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.error,
  },
  version: {
    textAlign: 'center',
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 20,
  }
});