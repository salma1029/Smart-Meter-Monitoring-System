import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Switch } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/common/Card';
import Icon from '../components/common/Icon';
import { auth, db } from '../utils/firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { Svg, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const InfoRow = ({ icon, label, value, color, index, theme }) => (
  <Animated.View entering={FadeInRight.delay(index * 100).duration(600)} style={styles.infoRow}>
    <View style={[styles.infoIconBg, { backgroundColor: `${color}15` }]}>
      <Icon name={icon} size={20} color={color} />
    </View>
    <View style={styles.infoText}>
      <Text style={[styles.infoLabel, { color: theme.textMuted }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: theme.text }]}>{value || 'Not provided'}</Text>
    </View>
  </Animated.View>
);

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(auth.currentUser);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme, isDark, toggleTheme } = useTheme();

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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(800)} style={styles.profileHeader}>
          <View style={styles.avatarWrapper}>
            <Svg height="120" width="120" style={styles.avatarSvg}>
              <Defs>
                <LinearGradient id="avatarGrad" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0" stopColor={theme.primary} />
                  <Stop offset="1" stopColor={theme.secondary} />
                </LinearGradient>
              </Defs>
              <Circle cx="60" cy="60" r="58" stroke="url(#avatarGrad)" strokeWidth="3" fill="none" strokeDasharray="10 5" />
            </Svg>
            <View style={[styles.avatarContainer, { backgroundColor: theme.primary, shadowColor: theme.primary }]}>
              <Text style={styles.avatarInitial}>{user?.displayName ? user.displayName[0] : 'U'}</Text>
            </View>
          </View>

          <Text style={[styles.userName, { color: theme.text }]}>{user?.displayName || 'Smart User'}</Text>
          <Text style={[styles.userEmail, { color: theme.textMuted }]}>{user?.email || 'user@smartmeter.com'}</Text>
        </Animated.View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Utility Information</Text>
          <Card style={[styles.infoCard, { backgroundColor: theme.card }]}>
            {loading ? (
              <ActivityIndicator color={theme.primary} style={{ padding: 20 }} />
            ) : (
              <>
                <InfoRow
                  index={0}
                  icon="bell"
                  label="Phone Number"
                  value={profileData?.phone}
                  color={theme.primary}
                  theme={theme}
                />
                <View style={[styles.divider, { backgroundColor: theme.border }]} />
                <InfoRow
                  index={1}
                  icon="cpu"
                  label="Smart Meter ID"
                  value={profileData?.meterId}
                  color={theme.secondary}
                  theme={theme}
                />
                <View style={[styles.divider, { backgroundColor: theme.border }]} />
                <InfoRow
                  index={2}
                  icon="home"
                  label="Installation Address"
                  value={profileData?.address}
                  color="#10B981"
                  theme={theme}
                />
              </>
            )}
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Preferences</Text>
          <Card style={[styles.infoCard, { backgroundColor: theme.card }]}>
            <View style={styles.preferenceRow}>
              <View style={[styles.infoIconBg, { backgroundColor: isDark ? '#334155' : '#F1F5F9' }]}>
                <Icon name={isDark ? "moon" : "sun"} size={20} color={isDark ? theme.accent : theme.warning} />
              </View>
              <View style={styles.infoText}>
                <Text style={[styles.preferenceLabel, { color: theme.text }]}>Dark Mode</Text>
                <Text style={[styles.preferenceSubLabel, { color: theme.textMuted }]}>Toggle application appearance</Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: '#CBD5E1', true: theme.primaryLight }}
                thumbColor={isDark ? theme.primary : '#F8FAFC'}
              />
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Account Actions</Text>
          <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: `${theme.error}08`, borderColor: `${theme.error}15` }]} onPress={handleLogout}>
            <View style={[styles.logoutIconBg, { backgroundColor: `${theme.error}15` }]}>
              <Icon name="arrow-left" size={20} color={theme.error} />
            </View>
            <Text style={styles.logoutText}>Sign Out of System</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.version, { color: theme.textMuted }]}>Smart Meter System v2.4.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  avatarInitial: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  userEmail: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
    marginLeft: 4,
  },
  infoCard: {
    padding: 12,
    borderRadius: 28,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  preferenceRow: {
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
    textTransform: 'uppercase',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  preferenceSubLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  logoutIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 20,
  }
});