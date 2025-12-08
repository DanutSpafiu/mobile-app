import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthScreenProps {
  onLoginSuccess: () => void;
}

export default function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = "https://interestuarine-tragically-karl.ngrok-free.dev";

  const handleSubmit = async () => {
    if (isLogin) {
      // Handle login
      if (!email || !password) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          const message = data?.error || "Failed to login";
          Alert.alert("Error", message);
          return;
        }

        // Store token and user data
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));

        // Navigate to WelcomeScreen
        onLoginSuccess();
      } catch (error) {
        console.error("Login error:", error);
        Alert.alert("Error", "Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      // Handle sign up
      if (!email || !password || !confirmPassword || !username) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match");
        return;
      }
      if (password.length < 6) {
        Alert.alert("Error", "Password must be at least 6 characters");
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          const message = data?.error || "Failed to create account";
          Alert.alert("Error", message);
          return;
        }

        // Store token and user data after registration
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));

        Alert.alert("Success", "Account created successfully!");
        // Navigate to WelcomeScreen after successful registration
        onLoginSuccess();
      } catch (error) {
        console.error("Sign up error:", error);
        Alert.alert("Error", "Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.emoji}>🎄</Text>
            <Text style={styles.title}>
              {isLogin ? "Welcome Back!" : "Create Your Account"}
            </Text>
            <Text style={styles.subtitle}>
              {isLogin
                ? "✨ Sign in to decorate your tree ✨"
                : "🌟 Join the festive fun! 🌟"}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {!isLogin && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your username"
                  placeholderTextColor="#999"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {!isLogin && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm your password"
                  placeholderTextColor="#999"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            )}

            {isLogin && (
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.submitButton,
                isLoading && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {isLogin ? "Sign In" : "Sign Up"}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Toggle between Login and Sign Up */}
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
            </Text>
            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
              <Text style={styles.toggleLink}>
                {isLogin ? "Sign Up" : "Sign In"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e", // Deep dark blue-purple base
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFD700", // Gold
    marginBottom: 12,
    textAlign: "center",
    textShadowColor: "rgba(255, 215, 0, 0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "#E8D5B7", // Warm cream
    textAlign: "center",
    lineHeight: 22,
  },
  form: {
    width: "100%",
    backgroundColor: "rgba(139, 0, 0, 0.3)", // Semi-transparent deep red
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    borderColor: "rgba(212, 175, 55, 0.3)", // Gold border
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFD700", // Gold
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: "#1a1a2e",
    borderWidth: 2,
    borderColor: "rgba(212, 175, 55, 0.4)", // Gold border
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
    marginTop: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#E8D5B7", // Warm cream
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  submitButton: {
    backgroundColor: "#C41E3A", // Deep red
    borderRadius: 20,
    padding: 18,
    alignItems: "center",
    marginTop: 8,
    borderWidth: 2,
    borderColor: "#FFD700", // Gold border
    shadowColor: "#C41E3A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonText: {
    color: "#FFD700", // Gold text
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
    flexWrap: "wrap",
  },
  toggleText: {
    fontSize: 14,
    color: "#E8D5B7", // Warm cream
  },
  toggleLink: {
    fontSize: 14,
    color: "#FFD700", // Gold
    fontWeight: "700",
    textDecorationLine: "underline",
    marginLeft: 4,
  },
});
