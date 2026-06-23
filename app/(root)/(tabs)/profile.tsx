import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleUpdateProfileImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library to update your profile picture.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (result.canceled) return;

      setIsUpdating(true);

      const base64Image = result.assets[0].base64;
      const uri = result.assets[0].uri;
      const filename = uri.split("/").pop() || "profile.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const mimeType = match ? `image/${match[1]}` : "image/jpeg";
      const dataUrl = `data:${mimeType};base64,${base64Image}`;

      await user?.setProfileImage({ file: dataUrl });

      Alert.alert("Success", "Profile picture updated successfully!");
    } catch (error) {
      console.error("Error updating profile image:", error);
      Alert.alert(
        "Error",
        "Failed to update profile picture. Please try again.",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isLoaded || !user) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#FFFFFF",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color="#3B82F6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#FFFFFF", marginBottom: 40 }}
    >
      {/* Avatar + Name */}
      <View style={{ alignItems: "center", paddingVertical: 32 }}>
        <View style={{ position: "relative" }}>
          <Image
            source={{ uri: user.imageUrl }}
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              marginBottom: 16,
            }}
          />
          <TouchableOpacity
            onPress={handleUpdateProfileImage}
            disabled={isUpdating}
            style={{
              position: "absolute",
              bottom: 12,
              right: 0,
              backgroundColor: "#2563EB",
              borderRadius: 9999,
              padding: 8,
            }}
          >
            {isUpdating ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="camera" size={16} color="white" />
            )}
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#1F2937" }}>
          {user.firstName} {user.lastName}
        </Text>
        <Text style={{ color: "#6B7280", marginTop: 4 }}>
          {user.emailAddresses[0].emailAddress}
        </Text>
      </View>

      {/* Menu Items */}
      <View style={{ paddingHorizontal: 24, gap: 8 }}>
        <MenuItem
          icon="heart-outline"
          label="Saved Properties"
          onPress={() => router.push("/(root)/(tabs)/saved")}
        />
        <MenuItem
          icon="notifications-outline"
          label="Notifications"
          onPress={() =>
            Alert.alert("Coming Soon", "Notifications coming soon!")
          }
        />
        <MenuItem
          icon="settings-outline"
          label="Settings"
          onPress={() => Alert.alert("Coming Soon", "Settings coming soon!")}
        />
        <MenuItem
          icon="help-circle-outline"
          label="Help & Support"
          onPress={() =>
            Linking.openURL(
              "mailto:sounak1098@gmail.com?subject=Help%20%26%20Support%20-%20Kribb%20App",
            )
          }
        />
      </View>

      {/* Sign Out */}
      <View
        style={{ paddingHorizontal: 24, marginTop: "auto", marginBottom: 32 }}
      >
        <TouchableOpacity
          onPress={handleSignOut}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            backgroundColor: "#FEF2F2",
            paddingVertical: 16,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#FEE2E2",
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={{ color: "#EF4444", fontWeight: "600", fontSize: 16 }}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function MenuItem({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        backgroundColor: "#F9FAFB",
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderRadius: 16,
      }}
    >
      <Ionicons name={icon} size={22} color="#6B7280" />
      <Text
        style={{ flex: 1, color: "#374151", fontWeight: "500", fontSize: 16 }}
      >
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
    </TouchableOpacity>
  );
}
