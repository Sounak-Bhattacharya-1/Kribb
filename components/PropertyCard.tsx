import { useSavedProperty } from "@/hooks/useSavedProperty";
import { formatPrice } from "@/lib/utils";
import { Property } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function PropertyCard({
  property,
  onUnsave,
  showSave = false,
}: {
  property: Property;
  onUnsave?: () => void;
  showSave?: boolean;
}) {
  const router = useRouter();

  const { isSaved, saveLoading, toggleSave } = useSavedProperty(
    property.id,
    onUnsave,
  );

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        overflow: "hidden",
        marginRight: 8,
        borderRadius: 24,
        marginBottom: 16,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        opacity: property.is_sold ? 0.5 : 1,
      }}
      onPress={() => router.push(`/(root)/property/${property.id}`)}
    >
      <Image
        source={
          property.images.length > 0
            ? { uri: property.images[0] }
            : require("@/assets/images/kribb.png")
        }
        style={{ width: 112, height: 112 }}
        resizeMode="cover"
      />

      <View style={{ flex: 1, padding: 12, justifyContent: "space-between" }}>
        <View>
          <Text
            style={{
              fontSize: 14,
              lineHeight: 20,
              fontWeight: "700",
              color: "#1F2937",
              marginBottom: 4,
            }}
            numberOfLines={1}
          >
            {property.title}
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Ionicons name="location-outline" size={11} color="#6B7280" />
            <Text
              style={{ fontSize: 12, lineHeight: 16, color: "#6B7280" }}
              numberOfLines={1}
            >
              {property.city}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          <Text
            style={{
              color: "#2563EB",
              fontWeight: "700",
              fontSize: 14,
              lineHeight: 20,
            }}
          >
            {formatPrice(property.price)}
          </Text>

          {property.is_sold && (
            <View
              style={{
                backgroundColor: "#FEF2F2",
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 9999,
              }}
            >
              <Text
                style={{
                  color: "#EF4444",
                  fontSize: 12,
                  lineHeight: 16,
                  fontWeight: "600",
                }}
              >
                Sold
              </Text>
            </View>
          )}

          <View style={{ flexDirection: "row", gap: 10 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Ionicons name="bed-outline" size={11} color="#6B7280" />
              <Text style={{ fontSize: 12, lineHeight: 16, color: "#6B7280" }}>
                {property.bedrooms} bd
              </Text>
            </View>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Ionicons name="expand-outline" size={11} color="#6B7280" />
              <Text style={{ fontSize: 12, lineHeight: 16, color: "#6B7280" }}>
                {property.area_sqft} ft²
              </Text>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={toggleSave}
        disabled={saveLoading}
        style={{ width: 40, paddingTop: 12, alignItems: "center" }}
      >
        <Ionicons
          name={isSaved ? "heart" : "heart-outline"}
          size={18}
          color={isSaved ? "#EF4444" : "#9CA3AF"}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
