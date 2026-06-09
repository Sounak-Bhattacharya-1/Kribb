import FeaturedCard from "@/components/FeaturedCard";
import PropertyCard from "@/components/PropertyCard";
import { supabase } from "@/lib/supabase";
import { Property } from "@/types";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();

  const [featured, setFeatured] = useState<Property[]>([]);
  const [recommended, setRecommended] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    setLoading(true);

    const { data: featuredData, error: featuredError } = await supabase
      .from("properties")
      .select("*")
      .eq("is_featured", true)
      .order("created_at", { ascending: false });

    const { data: recommendedData, error: recommendedError } = await supabase
      .from("properties")
      .select("*")
      .eq("is_featured", false)
      .order("created_at", { ascending: false });

    if (featuredError || recommendedError) {
      console.error(
        "Error fetching Properties:",
        featuredError || recommendedError,
      );
    }

    setFeatured(featuredData ?? []);
    setRecommended(recommendedData ?? []);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchProperties();
    }, []),
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <FlatList
        data={recommended}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: 16,
                paddingBottom: 20,
                paddingHorizontal: 20,
              }}
            >
              <Image
                source={require("../../../assets/images/kribb.png")}
                style={{ width: 90, height: 36 }}
                resizeMode="contain"
              />

              <View style={{ alignItems: "flex-end" }}>
                <Text>Good Morning 👋</Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                    color: "#111827",
                    lineHeight: 24,
                  }}
                >
                  {user?.firstName ?? "User"}
                </Text>
              </View>
            </View>

            {/* Search Bar */}
            <TouchableOpacity
              onPress={() => router.push("/(root)/(tabs)/search")}
              style={{
                marginHorizontal: 20,
                marginBottom: 24,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#fff",
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 16,
                gap: 12,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.06,
                shadowRadius: 6,
                elevation: 2,
              }}
            >
              <Ionicons name="search-outline" size={18} color="#9CA3AF" />
              <Text
                style={{
                  color: "#9CA3AF",
                  fontSize: 14,
                  lineHeight: 20,
                  flex: 1,
                }}
              >
                Search properties, cities...
              </Text>

              <TouchableOpacity
                onPress={() =>
                  router.push("/(root)/(tabs)/search?openFilters=true")
                }
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#2563EB",
                  borderRadius: 12,
                  width: 32,
                  height: 32,
                }}
              >
                <Ionicons name="options-outline" size={15} color="white" />
              </TouchableOpacity>
            </TouchableOpacity>

            {/* Featured Section */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  color: "#111827",
                  fontWeight: "700",
                  paddingHorizontal: 20,
                  marginBottom: 16,
                  fontSize: 18,
                  lineHeight: 28,
                }}
              >
                Featured
              </Text>

              {loading ? (
                <ActivityIndicator
                  size="small"
                  color="#2563EB"
                  style={{ paddingHorizontal: 40 }}
                />
              ) : (
                <View style={{ height: 290 }}>
                  <FlatList
                    data={featured}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <FeaturedCard property={item} />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                      paddingHorizontal: 20,
                      paddingBottom: 9,
                    }}
                  />
                </View>
              )}
            </View>

            <Text
              style={{
                color: "#111827",
                fontWeight: "700",
                paddingHorizontal: 20,
                marginBottom: 16,
                fontSize: 18,
                lineHeight: 28,
              }}
            >
              Recommended
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 20 }}>
            <PropertyCard property={item} />
          </View>
        )}
        ListEmptyComponent={
          !loading ? (
            <View style={{ alignItems: "center", paddingVertical: 40 }}>
              <Text style={{ color: "#9CA3AF" }}>No Properties found</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
