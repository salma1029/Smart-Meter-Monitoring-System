import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import PrimaryButton from '../components/buttons/PrimaryButton';
import colors from '../utils/colors';
import font from '../assets/fonts/font';

const SignUpScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.logoPlaceholder}><Text>⚡</Text></View>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Start monitoring your energy today</Text>
      </View>
      
      <View style={styles.formContainer}>
        <Text style={styles.headerText}>Sign Up</Text>
        <TextInput style={styles.input} placeholder="Full Name" />
        <TextInput style={styles.input} placeholder="Email" />
        <TextInput style={styles.input} placeholder="Phone Number" />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry />
        <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry />
        
        <Text style={styles.termsText}>I agree to the Terms of Service and Privacy Policy</Text>
        
        <PrimaryButton title="Create Account" onPress={() => {}} style={styles.button} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.background, padding: 24, justifyContent: 'center' },
  headerContainer: { alignItems: 'center', marginBottom: 40, marginTop: 40 },
  logoPlaceholder: { width: 48, height: 48, borderRadius: 8, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { ...font.title, color: colors.text, marginBottom: 8 },
  subtitle: { ...font.regular, color: colors.muted },
  formContainer: { backgroundColor: colors.surface, padding: 24, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  headerText: { ...font.header, color: colors.text, marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 16, marginBottom: 16, ...font.regular },
  termsText: { ...font.regular, color: colors.muted, textAlign: 'center', marginBottom: 24 },
  button: { marginTop: 8 },
});

export default SignUpScreen;
