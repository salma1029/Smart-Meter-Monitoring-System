import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { auth, db } from '../utils/firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import colors from '../assets/styles/colors';
import AuthForm from '../components/auth/AuthForm';

export default function SignUpScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async ({ email, password, name, phone, meterId, address }) => {
    if (!email || !password || !name || !phone || !meterId || !address) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 1. Update auth profile (for personalized greeting)
      await updateProfile(user, { displayName: name });

      // 2. Save extended profile to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        phone,
        meterId,
        address,
        createdAt: new Date().toISOString()
      });

    } catch (err) {
      setError(err.message.includes('email-already-in-use') ? 'Email already registered' : 'Failed to create account');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <AuthForm
          mode="signup"
          onSubmit={handleSignUp}
          loading={loading}
          error={error}
        />
        <TouchableOpacity
          style={styles.switchBtn}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.switchText}>
            Already have an account? <Text style={styles.switchLink}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  switchBtn: {
    marginTop: 24,
    alignItems: 'center',
    marginBottom: 40,
  },
  switchText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  switchLink: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});