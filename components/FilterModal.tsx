import { PropertyType, useFilterStore } from "@/store/filterStore";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TextStyle,
    TouchableOpacity,
    View,
} from "react-native";

const TYPES: { label: string; value: PropertyType }[] = [
  { label: "All", value: null },
  { label: "Apartment", value: "apartment" },
  { label: "House", value: "house" },
  { label: "Villa", value: "villa" },
  { label: "Studio", value: "studio" },
];

const BEDS = [
  { label: "Any", value: null },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4+", value: 4 },
];

const PRICE_PRESETS = [
  { label: "Under ₹50L", min: null, max: 5000000 },
  { label: "₹50L – ₹1Cr", min: 5000000, max: 10000000 },
  { label: "₹1Cr – ₹2Cr", min: 10000000, max: 20000000 },
  { label: "Above ₹2Cr", min: 20000000, max: null },
];

const chip = (active: boolean) => ({
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 9999,
  borderWidth: 1,
  backgroundColor: active ? "#2563EB" : "#FFFFFF",
  borderColor: active ? "#2563EB" : "#E5E7EB",
});

const chipText = (active: boolean): TextStyle => ({
  fontSize: 14,
  fontWeight: "600",
  color: active ? "#FFFFFF" : "#4B5563",
});

export default function FilterModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const {
    type,
    bedrooms,
    minPrice,
    maxPrice,
    setType,
    setBedrooms,
    setMinPrice,
    setMaxPrice,
    resetFilters,
  } = useFilterStore();

  const [localMin, setLocalMin] = useState(minPrice ? String(minPrice) : "");
  const [localMax, setLocalMax] = useState(maxPrice ? String(maxPrice) : "");

  const activeCount = [type, bedrooms, minPrice, maxPrice].filter(
    (v) => v !== null,
  ).length;

  const handleApply = () => {
    setMinPrice(localMin ? Number(localMin) : null);
    setMaxPrice(localMax ? Number(localMax) : null);
    onClose();
  };

  const handleReset = () => {
    setLocalMin("");
    setLocalMax("");
    resetFilters();
    onClose();
  };

  const shadow = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingTop: 24,
            paddingBottom: 16,
            backgroundColor: "#fff",
            borderBottomWidth: 1,
            borderColor: "#F3F4F6",
          }}
        >
          <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
            <Ionicons name="close" size={22} color="#374151" />
          </TouchableOpacity>

          <Text style={{ fontSize: 18, lineHeight: 28 }}>Filters</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text
              style={{
                color: "#2563EB",
                fontWeight: "600",
                fontSize: 14,
                lineHeight: 20,
              }}
            >
              Reset
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <Text
            style={{
              marginBottom: 12,
              fontSize: 16,
              lineHeight: 24,
              fontWeight: "700",
              color: "#1F2937",
            }}
          >
            Property Type
          </Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 24,
            }}
          >
            {TYPES.map((item) => (
              <TouchableOpacity
                key={String(item.value)}
                onPress={() => setType(item.value)}
                style={[chip(type === item.value), shadow]}
              >
                <Text style={chipText(type === item.value)}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text
            style={{
              marginBottom: 12,
              fontSize: 16,
              lineHeight: 24,
              fontWeight: "700",
              color: "#1F2937",
            }}
          >
            Bedrooms
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 7,
              marginBottom: 24,
            }}
          >
            {BEDS.map((item) => (
              <TouchableOpacity
                key={String(item.value)}
                onPress={() => setBedrooms(item.value)}
                style={[
                  styles.baseContainer,
                  chip(bedrooms === item.value),
                  shadow,
                ]}
              >
                <Text
                  style={[chipText(bedrooms === item.value), styles.baseText]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text
            style={{
              marginBottom: 12,
              fontSize: 16,
              lineHeight: 24,
              fontWeight: "700",
              color: "#1F2937",
            }}
          >
            Price Range (₹)
          </Text>
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
            {[
              {
                label: "Min Price",
                value: localMin,
                onChange: setLocalMin,
                placeholder: "0",
              },
              {
                label: "Max Price",
                value: localMax,
                onChange: setLocalMax,
                placeholder: "Any",
              },
            ].map(({ label, value, onChange, placeholder }) => (
              <View key={label} style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#6b7280",
                    marginBottom: 6,
                    fontWeight: "500",
                  }}
                >
                  {label}
                </Text>
                <View style={[styles.priceContainer, shadow]}>
                  <Text
                    style={{
                      color: "#9ca3af",
                      fontSize: 14,
                      marginRight: 4,
                    }}
                  >
                    ₹
                  </Text>
                  <TextInput
                    style={{ flex: 1, paddingVertical: 12, color: "#1f2937" }}
                    placeholder={placeholder}
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={value}
                    onChangeText={onChange}
                  />
                </View>
              </View>
            ))}
          </View>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 24,
            }}
          >
            {PRICE_PRESETS.map((p) => {
              const active = minPrice === p.min && maxPrice === p.max;
              return (
                <TouchableOpacity
                  key={p.label}
                  onPress={() => {
                    setLocalMin(p.min ? String(p.min) : "");
                    setLocalMax(p.max ? String(p.max) : "");
                    setMinPrice(p.min);
                    setMaxPrice(p.max);
                  }}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 9999,
                    borderWidth: 1,
                    backgroundColor: active ? "#EFF6FF" : "#FFFFFF",
                    borderColor: active ? "#93C5FD" : "#E5E7EB",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "500",
                      color: active ? "#2563EB" : "#6B7280",
                    }}
                  >
                    {p.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View
          style={{
            paddingHorizontal: 20,
            paddingBottom: 32,
            paddingTop: 16,
            backgroundColor: "#ffffff",
            borderTopWidth: 1,
            borderTopColor: "#f3f4f6",
          }}
        >
          <TouchableOpacity
            onPress={handleApply}
            style={{
              backgroundColor: "#2563eb",
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: "center",
              shadowColor: "#2563EB",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text
              style={{ color: "#ffffff", fontWeight: "bold", fontSize: 16 }}
            >
              Apply Filters{activeCount > 0 ? ` (${activeCount})` : ""}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  baseContainer: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  baseText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
});
