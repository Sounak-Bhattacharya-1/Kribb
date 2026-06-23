import { useSavedProperty } from "@/hooks/useSavedProperty";
import { useSupabase } from "@/hooks/useSupabase";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import { Property } from "@/types";
import { useAuth } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    Linking,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import ImageViewing from "react-native-image-viewing";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

const { width } = Dimensions.get("window");
const ADMIN_PHONE = "916290858693";

export default function PropertyDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { userId } = useAuth();
  const router = useRouter();
  const isAdmin = useUserStore((state) => state.isAdmin);

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);

  const { isSaved, saveLoading, toggleSave } = useSavedProperty(id ?? "");
  const authSupabase = useSupabase();

  const fetchProperty = async () => {
    const { data } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();

    setProperty(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const handleDelete = () => {
    Alert.alert("Delete Property", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await authSupabase.from("properties").delete().eq("id", id);
          router.replace("/(root)/(tabs)");
        },
      },
    ]);
  };

  const handleMarkSold = () => {
    Alert.alert("Mark as Sold", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Mark Sold",
        onPress: async () => {
          await authSupabase
            .from("properties")
            .update({ is_sold: true })
            .eq("id", id);
          setProperty((prev) => (prev ? { ...prev, is_sold: true } : prev));
        },
      },
    ]);
  };

  const handleContact = () => {
    const message = `Hi! I'm interested in the property: ${property?.title}`;
    const url = `https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(
      message,
    )}`;
    Linking.openURL(url);
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  if (!property) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">Property not found</Text>
      </View>
    );
  }

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    property.longitude - 0.003
  }%2C${property.latitude - 0.003}%2C${property.longitude + 0.003}%2C${
    property.latitude + 0.003
  }&layer=mapnik&marker=${property.latitude}%2C${property.longitude}`;

  const isLongDesc = (property.description?.length ?? 0) > 150;
  const displayDesc =
    expanded || !isLongDesc
      ? property.description
      : property.description?.slice(0, 150) + "...";

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <View style={{ opacity: property.is_sold ? 0.5 : 1 }}>
            <FlatList
              data={property.images}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setImageViewerVisible(true)}>
                  <Image
                    source={{ uri: item }}
                    style={{ width, height: 300 }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={onScroll}
              scrollEventThrottle={16}
            />
          </View>
          <View
            style={{
              position: "absolute",
              bottom: 12,
              right: 16,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 9999,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 12,
                fontWeight: "500",
              }}
            >
              {activeIndex + 1}/{property.images.length}
            </Text>
          </View>

          <SafeAreaView
            style={{ position: "absolute", top: 0, left: 0, right: 0 }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 16,
                paddingTop: 8,
              }}
            >
              <TouchableOpacity
                onPress={() => router.back()}
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: "#fff",
                  borderRadius: 9999,
                  alignItems: "center",
                  justifyContent: "center",
                  elevation: 3,
                }}
              >
                <Ionicons name="arrow-back" size={20} color="#111827" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={toggleSave}
                disabled={saveLoading}
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: "#fff",
                  borderRadius: 9999,
                  alignItems: "center",
                  justifyContent: "center",
                  elevation: 3,
                }}
              >
                <Ionicons
                  name={isSaved ? "heart" : "heart-outline"}
                  size={20}
                  color={isSaved ? "#EF4444" : "#111827"}
                />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 32,
            opacity: property.is_sold ? 0.6 : 1,
          }}
        >
          {/* Badges */}
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              marginBottom: 12,
              flexWrap: "wrap",
            }}
          >
            <View
              style={{
                backgroundColor: "#eff6ff",
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 9999,
              }}
            >
              <Text
                style={{
                  color: "#2563eb",
                  fontSize: 12,
                  fontWeight: "600",
                  textTransform: "capitalize",
                }}
              >
                {property.type}
              </Text>
            </View>

            {property.is_featured && (
              <View
                style={{
                  backgroundColor: "#fffbeb",
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: 9999,
                }}
              >
                <Text
                  style={{
                    color: "#d97706",
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  ⭐ Featured
                </Text>
              </View>
            )}

            {property.is_sold && (
              <View
                style={{
                  backgroundColor: "#fef2f2",
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: 9999,
                }}
              >
                <Text
                  style={{
                    color: "#ef4444",
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  Sold
                </Text>
              </View>
            )}
          </View>

          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#111827",
              marginBottom: 4,
            }}
          >
            {property.title}
          </Text>
          <Text
            style={{
              color: "#2563eb",
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 16,
            }}
          >
            {formatPrice(property.price)}
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: "#F9FAFB", // gray-50
              borderRadius: 16, // rounded-2xl
              padding: 16, // p-4
              marginBottom: 20, // mb-5
            }}
          >
            <SpecItem
              icon="bed-outline"
              label="Beds"
              value={`${property.bedrooms}`}
            />
            <SpecItem
              icon="water-outline"
              label="Baths"
              value={`${property.bathrooms}`}
            />
            <SpecItem
              icon="expand-outline"
              label="Area"
              value={`${property.area_sqft} ft²`}
            />
            <SpecItem icon="home-outline" label="Type" value={property.type} />
          </View>

          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: "#111827",
              marginBottom: 8,
            }}
          >
            Description
          </Text>
          <Text
            style={{
              color: "#6b7280",
              fontSize: 14,
              lineHeight: 24,
              marginBottom: 4,
            }}
          >
            {displayDesc}
          </Text>
          {isLongDesc && (
            <TouchableOpacity onPress={() => setExpanded(!expanded)}>
              <Text
                style={{
                  color: "#2563eb",
                  fontSize: 14,
                  fontWeight: "500",
                  marginBottom: 20,
                }}
              >
                {expanded ? "Show less" : "Read more"}
              </Text>
            </TouchableOpacity>
          )}

          <View style={{ marginBottom: 20, marginTop: 20 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "#111827",
                marginBottom: 8,
              }}
            >
              Location
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <Ionicons name="location-outline" size={16} color="#6B7280" />
              <Text style={{ color: "#6B7280", fontSize: 14, flex: 1 }}>
                {property.address}, {property.city}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/(root)/property/map",
                params: {
                  latitude: property.latitude,
                  longitude: property.longitude,
                  title: property.title,
                  address: `${property.address}, ${property.city}`,
                },
              })
            }
            activeOpacity={0.9}
            style={{
              borderRadius: 16,
              overflow: "hidden",
              marginBottom: 24,
              height: 200,
            }}
          >
            <WebView
              source={{ uri: mapUrl }}
              style={{ flex: 1 }}
              scrollEnabled={false}
              pointerEvents="none"
            />
            <View
              style={{
                position: "absolute",
                bottom: 12,
                right: 12,
                backgroundColor: "rgba(255,255,255,0.9)",
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 9999,
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Ionicons name="expand-outline" size={12} color="#374151" />
              <Text
                style={{ color: "#4B5563", fontSize: 12, fontWeight: "500" }}
              >
                Tap to expand
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleContact}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              backgroundColor: "#2563eb",
              paddingVertical: 16,
              borderRadius: 16,
              marginBottom: 16,
            }}
          >
            <Ionicons name="logo-whatsapp" size={20} color="white" />
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
              Contact Agent
            </Text>
          </TouchableOpacity>

          {isAdmin && (
            <View style={{ flexDirection: "row", gap: 12 }}>
              {!property.is_sold && (
                <TouchableOpacity
                  onPress={handleMarkSold}
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    backgroundColor: "#FFFBEB",
                    paddingVertical: 16,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: "#FDE68A",
                  }}
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={18}
                    color="#D97706"
                  />
                  <Text style={{ color: "#D97706", fontWeight: "600" }}>
                    Mark Sold
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={handleDelete}
                style={{
                  flex: 1,
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
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
                <Text style={{ color: "#EF4444", fontWeight: "600" }}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <ImageViewing
        images={property.images.map((uri) => ({ uri }))}
        imageIndex={activeIndex}
        visible={imageViewerVisible}
        onRequestClose={() => setImageViewerVisible(false)}
      />
    </View>
  );
}

function SpecItem({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={{ alignItems: "center", gap: 4 }}>
      <Ionicons name={icon} size={20} color="#2563EB" />
      <Text style={{ color: "#111827", fontWeight: "bold", fontSize: 14 }}>
        {value}
      </Text>
      <Text style={{ color: "#9ca3af", fontSize: 12 }}>{label}</Text>
    </View>
  );
}
