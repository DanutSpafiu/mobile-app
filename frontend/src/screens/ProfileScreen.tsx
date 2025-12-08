import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ProfileScreenProps {
  onClose: () => void;
}

interface ProfileData {
  username: string;
  email: string;
  profilePicture: string | null;
}

const ProfileScreen = ({ onClose }: ProfileScreenProps) => {
  const [profileData, setProfileData] = useState<ProfileData>({
    username: "",
    email: "",
    profilePicture: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userStr = await AsyncStorage.getItem("user");
      const profileStr = await AsyncStorage.getItem("profile");

      if (userStr) {
        const user = JSON.parse(userStr);
        setProfileData((prev) => ({
          ...prev,
          username: user.username || "",
          email: user.email || "",
        }));
      }

      if (profileStr) {
        const profile = JSON.parse(profileStr);
        setProfileData((prev) => ({
          ...prev,
          profilePicture: profile.profilePicture || null,
          username: profile.username || profileData.username,
        }));
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "We need camera roll permissions to select a profile picture!"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileData((prev) => ({
          ...prev,
          profilePicture: result.assets[0].uri,
        }));
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "We need camera permissions to take a photo!"
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileData((prev) => ({
          ...prev,
          profilePicture: result.assets[0].uri,
        }));
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert("Select Profile Picture", "Choose an option", [
      { text: "Camera", onPress: takePhoto },
      { text: "Photo Library", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await AsyncStorage.setItem("profile", JSON.stringify(profileData));
      Alert.alert("Success", "Profile updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🎄 Your Profile</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Picture Section */}
        <View style={styles.profilePictureSection}>
          <View style={styles.profilePictureContainer}>
            {profileData.profilePicture ? (
              <Image
                source={{ uri: profileData.profilePicture }}
                style={styles.profilePicture}
              />
            ) : (
              <View style={styles.profilePicturePlaceholder}>
                <Text style={styles.profilePicturePlaceholderText}>👤</Text>
              </View>
            )}
            <View style={styles.profilePictureBorder} />
          </View>
          <TouchableOpacity
            style={styles.changePictureButton}
            onPress={showImagePickerOptions}
          >
            <Text style={styles.changePictureButtonText}>
              📷 Change Picture
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={profileData.username}
              onChangeText={(text) =>
                setProfileData((prev) => ({ ...prev, username: text }))
              }
              placeholder="Enter your username"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={profileData.email}
              editable={false}
              placeholder="Email cannot be changed"
              placeholderTextColor="#999"
            />
            <Text style={styles.inputHint}>Email cannot be changed</Text>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#FFD700" />
          ) : (
            <Text style={styles.saveButtonText}>💾 Save Profile</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD700",
    textShadowColor: "rgba(255, 215, 0, 0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(196, 30, 58, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.4)",
  },
  closeButtonText: {
    color: "#E8D5B7",
    fontSize: 20,
    fontWeight: "bold",
  },
  profilePictureSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  profilePictureContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#FFD700",
  },
  profilePicturePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(212, 175, 55, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#FFD700",
  },
  profilePicturePlaceholderText: {
    fontSize: 60,
  },
  profilePictureBorder: {
    position: "absolute",
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 2,
    borderColor: "#C41E3A",
    top: -4,
    left: -4,
  },
  changePictureButton: {
    backgroundColor: "rgba(15, 81, 50, 0.5)",
    borderRadius: 16,
    padding: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.4)",
  },
  changePictureButtonText: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "600",
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFD700",
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
    borderColor: "rgba(212, 175, 55, 0.4)",
  },
  inputDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    opacity: 0.7,
  },
  inputHint: {
    fontSize: 12,
    color: "#E8D5B7",
    marginTop: 4,
    marginLeft: 4,
    fontStyle: "italic",
  },
  saveButton: {
    backgroundColor: "#0F5132",
    borderRadius: 20,
    padding: 18,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFD700",
    shadowColor: "#0F5132",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
});
