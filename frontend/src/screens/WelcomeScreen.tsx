import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfileScreen from "./ProfileScreen";
import GlobeDesignerScreen from "./GlobeDesignerScreen";

interface WelcomeScreenProps {
  onLogout: () => void;
}

interface ProfileData {
  username: string;
  email: string;
  profilePicture: string | null;
}

const WelcomeScreen = ({ onLogout }: WelcomeScreenProps) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showGlobeDesigner, setShowGlobeDesigner] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userStr = await AsyncStorage.getItem("user");
      const profileStr = await AsyncStorage.getItem("profile");

      if (profileStr) {
        const profile = JSON.parse(profileStr);
        setProfileData(profile);
      } else if (userStr) {
        const user = JSON.parse(userStr);
        setProfileData({
          username: user.username || "",
          email: user.email || "",
          profilePicture: null,
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const handleProfileClose = () => {
    setShowProfile(false);
    loadProfile(); // Reload profile after closing
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("profile");
    onLogout();
  };

  if (showProfile) {
    return <ProfileScreen onClose={handleProfileClose} />;
  }

  if (showGlobeDesigner) {
    return <GlobeDesignerScreen onBack={() => setShowGlobeDesigner(false)} />;
  }

  return (
    <View style={styles.container}>
      {/* Profile Button in Upper Right */}
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => setShowProfile(true)}
      >
        {profileData?.profilePicture ? (
          <Image
            source={{ uri: profileData.profilePicture }}
            style={styles.profileButtonImage}
          />
        ) : (
          <View style={styles.profileButtonPlaceholder}>
            <Text style={styles.profileButtonPlaceholderText}>👤</Text>
          </View>
        )}
        <View style={styles.profileButtonBorder} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.emoji}>🎄✨</Text>
        <Text style={styles.title}>Welcome to Your</Text>
        <Text style={styles.titleAccent}>Christmas Tree Studio!</Text>
        <Text style={styles.subtitle}>
          🎨 Design your own ornaments and decorate your magical tree!🎨
        </Text>
        <Text style={styles.sparkle}>✨ 🌟 ✨</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.decorateButton}
            onPress={() => setShowGlobeDesigner(true)}
          >
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
  profileButton: {
    position: "absolute",
    top: 50,
    right: 24,
    zIndex: 10,
    width: 56,
    height: 56,
  },
  profileButtonImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: "#FFD700",
  },
  profileButtonPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(212, 175, 55, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFD700",
  },
  profileButtonPlaceholderText: {
    fontSize: 28,
  },
  profileButtonBorder: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#C41E3A",
    top: -2,
    left: -2,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
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
