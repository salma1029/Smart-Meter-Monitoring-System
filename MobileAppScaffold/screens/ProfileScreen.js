import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import colors from '../utils/colors';
import Card from '../components/common/Card';
import Icon from '../components/common/Icon';
import { auth } from '../utils/firebaseConfig';
import { signOut } from 'firebase/auth';
import Animated, { FadeInUp, FadeInDown, FadeInRight } from 'react-native-reanimated';
import { Svg, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');

const ProfileOption = ({ icon, label, sublabel, color, index, onPress }) => (
  <Animated.View entering={FadeInRight.delay(index * 100).duration(600)}>
    <TouchableOpacity style={styles.optionItem} onPress={onPress}>
      <View style={[styles.optionIconBg, { backgroundColor: `${color}15` }]}>
        <Icon name={icon} size={22} color={color} />
      </View>
      <View style={styles.optionText}>
        <Text style={styles.optionLabel}>{label}</Text>
        <Text style={styles.optionSublabel}>{sublabel}</Text>
      </View>
      <Icon name="arrow-left" size={20} color="#CBD5E1" style={{ transform: [{ rotate: '180deg' }] }} />
    </TouchableOpacity>
  </Animated.View>
);

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(auth.currentUser);

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
             <View style={styles.editBadge}>
                <Icon name="eye" size={12} color={colors.white} />
             </View>
          </View>
          
          <Text style={styles.userName}>{user?.displayName || 'Smart User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@smartmeter.com'}</Text>
          
          <View style={styles.statsGrid}>
             <View style={styles.statItem}>
                <Text style={styles.statValue}>12.4</Text>
                <Text style={styles.statLabel}>kWh Avg</Text>
             </View>
             <View style={styles.statDivider} />
             <View style={styles.statItem}>
                <Text style={styles.statValue}>89%</Text>
                <Text style={styles.statLabel}>Efficiency</Text>
             </View>
             <View style={styles.statDivider} />
             <View style={styles.statItem}>
                <Text style={styles.statValue}>5</Text>
                <Text style={styles.statLabel}>Awards</Text>
             </View>
          </View>
        </Animated.View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <Card style={styles.optionsCard}>
            <ProfileOption 
               index={0} 
               icon="user" 
               label="Account Security" 
               sublabel="Manage password & 2FA" 
               color={colors.primary} 
            />
            <View style={styles.divider} />
            <ProfileOption 
               index={1} 
               icon="bell" 
               label="Notification Hub" 
               sublabel="Alerts & weekly reports" 
               color={colors.secondary} 
            />
            <View style={styles.divider} />
            <ProfileOption 
               index={2} 
               icon="cpu" 
               label="Model Sensitivity" 
               sublabel="Tune NILM detection" 
               color={colors.accent} 
            />
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <Card style={styles.optionsCard}>
            <ProfileOption 
               index={3} 
               icon="bolt" 
               label="Export Data" 
               sublabel="CSV usage history" 
               color="#10B981" 
            />
            <View style={styles.divider} />
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
               <View style={styles.logoutIconBg}>
                  <Icon name="arrow-left" size={20} color={colors.error} />
               </View>
               <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
          </Card>
        </View>

        <Text style={styles.version}>App Version 2.4.0 (Stable)</Text>
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
  editBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    borderWidth: 3,
    borderColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
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
  statsGrid: {
    flexDirection: 'row',
    marginTop: 32,
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 15,
    elevation: 3,
    width: '100%',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#F1F5F9',
    alignSelf: 'center',
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
  optionsCard: {
    padding: 12,
    borderRadius: 28,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  optionIconBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  optionSublabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F8FAFC',
    marginHorizontal: 12,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginTop: 4,
  },
  logoutIconBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: `${colors.error}10`,
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
    marginTop: 8,
  }
});