import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Header from '../../../shared/components/Header';
import SignupForm from '../components/SignupForm';
import { signup } from '../services/authApi';

const SignupScreen = ({ navigation }) => {
  const handleSignup = async (userData) => {
    try {
      const response = await signup(userData);
      // Handle successful signup
    } catch (error) {
      // Handle signup error
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Sign Up" />
      <View style={styles.content}>
        <SignupForm onSubmit={handleSignup} />
        <TouchableOpacity
          onPress={() => navigation?.navigate('Login')}
          style={styles.link}
        >
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  link: {
    marginTop: 20,
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
  },
});

export default SignupScreen;
