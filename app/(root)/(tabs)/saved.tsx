import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function saved() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#c9c8c7" }}>
      <View>
        <Text>saved</Text>
      </View>
    </SafeAreaView>
  );
}
