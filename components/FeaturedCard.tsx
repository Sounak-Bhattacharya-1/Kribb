import { formatPrice } from "@/lib/utils";
import { Property } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function FeaturedCard({ property }: { property: Property }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={{
        overflow: "hidden",
        marginRight: 8,
        width: 288,
        borderRadius: 24,
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
        source={{ uri: property.images[0] }}
        style={{ width: "100%", height: 176 }}
        resizeMode="cover"
      />

      <View
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          paddingHorizontal: 12,
          paddingVertical: 4,
          borderRadius: 9999,
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: "600",
            color: "#2563EB",
            textTransform: "capitalize",
          }}
        >
          {property.type}
        </Text>
      </View>

      {property.is_sold && (
        <View
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            backgroundColor: "#ef4444",
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 9999,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: "600", color: "#FFFFFF" }}>
            Sold
          </Text>
        </View>
      )}

      <View style={{ padding: 16 }}>
        <Text
          style={{
            fontSize: 16,
            lineHeight: 24,
            fontWeight: "700",
            color: "#1F2937",
            marginBottom: 4,
          }}
          numberOfLines={1}
        >
          {property.title}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            marginBottom: 10,
          }}
        >
          <Ionicons name="location-outline" size={13} color={"#6B7280"} />
          <Text
            style={{ fontSize: 12, lineHeight: 16, color: "#6B7280" }}
            numberOfLines={1}
          >
            {property.address}, {property.city}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              lineHeight: 24,
              fontWeight: "700",
              color: "#2563EB",
            }}
          >
            {formatPrice(property.price)}
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Ionicons name="bed-outline" size={13} color="#6B7280" />
              <Text style={{ color: "#6B7280", fontSize: 12, lineHeight: 16 }}>
                {property.bedrooms}
              </Text>
            </View>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Ionicons name="water-outline" size={13} color="#6B7280" />
              <Text style={{ color: "#6B7280", fontSize: 12, lineHeight: 16 }}>
                {property.bathrooms}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
