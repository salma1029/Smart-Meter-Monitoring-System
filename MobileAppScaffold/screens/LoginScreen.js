import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import PrimaryButton from '../components/buttons/PrimaryButton';
import SecondaryButton from '../components/buttons/SecondaryButton';
import colors from '../utils/colors';
import font from '../assets/fonts/font';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.logoPlaceholder}><Text>⚡</Text></View>
        <Text style={styles.title}>Smart Meter</Text>
        <Text style={styles.subtitle}>Monitor your energy consumption</Text>
      </View>
      
      <View style={styles.formContainer}>
        <Text style={styles.headerText}>Welcome Back</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Email" 
          value={email}
          onChangeText={setEmail}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <View style={styles.row}>
          <Text style={styles.mutedText}>Remember me</Text>
          <Text style={styles.mutedText}>Forgot password</Text>
        </View>
        <PrimaryButton title="Sign In" onPress={() => {}} style={styles.button} />
        <View style={[styles.row, { justifyContent: 'center', marginTop: 16 }]}>
          <Text style={styles.mutedText}>Don't have an account? </Text>
          <Text style={styles.boldText}>Sign up</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 24, justifyContent: 'center' },
  headerContainer: { alignItems: 'center', marginBottom: 40 },
  logoPlaceholder: { width: 48, height: 48, borderRadius: 8, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { ...font.title, color: colors.text, marginBottom: 8 },
  subtitle: { ...font.regular, color: colors.muted },
  formContainer: { backgroundColor: colors.surface, padding: 24, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  headerText: { ...font.header, color: colors.text, marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 16, marginBottom: 16, ...font.regular },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  mutedText: { ...font.regular, color: colors.muted },
  boldText: { ...font.bold, color: colors.text },
  button: { marginTop: 8 },
});

export default LoginScreen;
