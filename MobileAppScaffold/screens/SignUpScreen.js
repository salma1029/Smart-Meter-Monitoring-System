import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert } from 'react-native';
import colors from '../utils/colors';
import InputField from '../components/common/InputField';
import PrimaryButton from '../components/buttons/PrimaryButton';
import Icon from '../components/common/Icon';
import { auth, db } from '../utils/firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [meterId, setMeterId] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !name) {
      Alert.alert('Error', 'Please fill in name, email and password');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      // Save extra profile data to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email,
        phone: phone || '',
        address: address || '',
        meterId: meterId || '',
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      Alert.alert('Sign Up Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Start monitoring your energy usage today</Text>
        </View>

        <View style={styles.card}>
          <InputField
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChangeText={setName}
            icon={<Icon name="user" size={20} color={colors.textMuted} />}
          />

          <InputField
            label="Email"
            placeholder="your.email@example.com"
            value={email}
            onChangeText={setEmail}
            icon={<Icon name="bell" size={20} color={colors.textMuted} />}
          />

          <InputField
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            icon={
              <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
                <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color={colors.textMuted} />
              </TouchableOpacity>
            }
          />

          <InputField
            label="Confirm Password"
            placeholder="Repeat your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            icon={
              <TouchableOpacity onPress={() => setShowConfirmPassword(v => !v)}>
                <Icon name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color={colors.textMuted} />
              </TouchableOpacity>
            }
          />

          <Text style={styles.sectionDivider}>Additional Details (Optional)</Text>

          <InputField
            label="Phone Number"
            placeholder="+1 (555) 123-4567"
            value={phone}
            onChangeText={setPhone}
            icon={<Icon name="bolt" size={20} color={colors.textMuted} />}
          />

          <InputField
            label="Address"
            placeholder="123 Smart St, Tech City"
            value={address}
            onChangeText={setAddress}
            icon={<Icon name="bolt" size={20} color={colors.textMuted} />}
          />

          <InputField
            label="Meter ID"
            placeholder="SM-2024-00123"
            value={meterId}
            onChangeText={setMeterId}
            icon={<Icon name="bolt" size={20} color={colors.textMuted} />}
          />

          <PrimaryButton
            title={loading ? "Creating Account..." : "Create Account"}
            onPress={handleSignUp}
            disabled={loading}
            style={styles.signUpButton}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.loginText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.termsText}>
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 8,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  signUpButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.text,
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  loginText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionDivider: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 16,
    marginTop: 8,
  },
  termsText: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 32,
    lineHeight: 18,
  },
});