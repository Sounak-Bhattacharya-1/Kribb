import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function index() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e0dede" }}>
      <View>
        <Text>HomeScreen</Text>
      </View>
    </SafeAreaView>
  );
}
