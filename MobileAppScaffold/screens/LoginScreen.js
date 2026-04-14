import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import colors from '../utils/colors';
import InputField from '../components/common/InputField';
import PrimaryButton from '../components/buttons/PrimaryButton';
import Icon from '../components/common/Icon';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Navigate to the main app (Tabs)
    navigation.replace('Main');
  };

  const navigateToSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.iconBadge}>
            <Icon name="bolt" size={40} color={colors.primary} />
          </View>
          <Text style={styles.title}>Smart Meter</Text>
          <Text style={styles.subtitle}>Monitor your energy consumption</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.welcomeText}>Welcome Back</Text>
          
          <InputField
            label="Email"
            placeholder="your.email@example.com"
            value={email}
            onChangeText={setEmail}
            icon={<Icon name="user" size={20} color={colors.textMuted} />}
          />

          <InputField
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon={<Icon name="bolt" size={20} color={colors.textMuted} />}
          />

          <View style={styles.forgotPasswordContainer}>
            <TouchableOpacity>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <PrimaryButton
            title="Sign In"
            onPress={handleLogin}
            style={styles.loginButton}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={navigateToSignUp}>
              <Text style={styles.signUpText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.termsText}>
          By signing in, you agree to our Terms of Service and Privacy Policy
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
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconBadge: {
    width: 80,
    height: 80,
    backgroundColor: colors.surface,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
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
  welcomeText: {
    fontSize: 24,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 24,
    textAlign: 'center',
    textAlign: 'center',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.text,
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
  signUpText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 32,
    lineHeight: 18,
  },
});