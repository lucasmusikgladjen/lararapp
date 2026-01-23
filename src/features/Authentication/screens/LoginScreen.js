import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Header from '../../../shared/components/Header';
import LoginForm from '../components/LoginForm';
import { login } from '../services/authApi';

const LoginScreen = ({ navigation }) => {
  const handleLogin = async (credentials) => {
    try {
      const response = await login(credentials);
      // Handle successful login
    } catch (error) {
      // Handle login error
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Login" />
      <View style={styles.content}>
        <LoginForm onSubmit={handleLogin} />
        <TouchableOpacity
          onPress={() => navigation?.navigate('Signup')}
          style={styles.link}
        >
          <Text style={styles.linkText}>Don't have an account? Sign up</Text>
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

export default LoginScreen;
