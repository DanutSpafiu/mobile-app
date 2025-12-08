import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface WelcomeScreenProps {
  onLogout: () => void;
}

const WelcomeScreen = ({ onLogout }: WelcomeScreenProps) => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    onLogout();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🎄✨</Text>
        <Text style={styles.title}>Welcome to Your</Text>
        <Text style={styles.titleAccent}>Christmas Tree Studio!</Text>
        <Text style={styles.subtitle}>
          🎨 Design your own ornaments and decorate your magical tree!🎨
        </Text>
        <Text style={styles.sparkle}>✨ 🌟 ✨</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.decorateButton}>
            <Text style={styles.decorateButtonText}>🎨 Start Decorating</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e", // Deep dark blue-purple base
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFD700", // Gold
    textAlign: "center",
    marginBottom: 4,
    textShadowColor: "rgba(255, 215, 0, 0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    letterSpacing: 1,
  },
  titleAccent: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#C41E3A", // Deep red
    textAlign: "center",
    marginBottom: 24,
    textShadowColor: "rgba(196, 30, 58, 0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: "#E8D5B7", // Warm cream
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  sparkle: {
    fontSize: 24,
    marginBottom: 48,
    color: "#FFD700",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 300,
    gap: 16,
  },
  decorateButton: {
    backgroundColor: "#0F5132", // Deep green
    borderRadius: 20,
    padding: 18,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFD700", // Gold border
    shadowColor: "#0F5132",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  decorateButtonText: {
    color: "#FFD700", // Gold text
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
  },
  logoutButton: {
    backgroundColor: "rgba(196, 30, 58, 0.3)", // Semi-transparent deep red
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.4)", // Gold border
  },
  logoutButtonText: {
    color: "#E8D5B7", // Warm cream
    fontSize: 16,
    fontWeight: "600",
  },
});
