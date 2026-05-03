import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert } from 'react-native';
import colors from '../utils/colors';
import InputField from '../components/common/InputField';
import PrimaryButton from '../components/buttons/PrimaryButton';
import Icon from '../components/common/Icon';
import { auth } from '../utils/firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Success', 'Password reset email sent!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>Enter your email to receive a reset link</Text>
        </View>
        <View style={styles.card}>
          <InputField
            label="Email"
            placeholder="your.email@example.com"
            value={email}
            onChangeText={setEmail}
            icon={<Icon name="bell" size={20} color={colors.textMuted} />}
          />
          <PrimaryButton
            title={loading ? "Sending..." : "Send Reset Link"}
            onPress={handleResetPassword}
            disabled={loading}
          />
          <TouchableOpacity style={styles.backToLogin} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.backToLoginText}>← Back to Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContainer: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  backButton: { position: 'absolute', top: 60, left: 24, zIndex: 1 },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.text },
  subtitle: { fontSize: 14, color: colors.textMuted, marginTop: 8, textAlign: 'center' },
  card: { backgroundColor: colors.surface, borderRadius: 24, padding: 24, elevation: 5 },
  backToLogin: { marginTop: 20, alignItems: 'center' },
  backToLoginText: { color: colors.primary, fontSize: 15, fontWeight: '600' },
});
