import { useAuth, useSignUp } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUp() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();

  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const isLoading = fetchStatus === "fetching";

  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  const onSignUpPress = async () => {
    const { error } = await signUp.password({
      emailAddress: email,
      password,
      firstName,
      lastName,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (!error) await signUp.verifications.sendEmailCode();
  };

  const onVerifyPress = async () => {
    await signUp.verifications.verifyEmailCode({
      code,
    });

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ decorateUrl }) => {
          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    }
  };

  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: 6,
          paddingVertical: 12,
          marginHorizontal: 10,
        }}
      >
        <Image
          source={require("../../assets/images/kribb.png")}
          style={{ width: 92, height: 62, marginBottom: 8 }}
          resizeMode="contain"
        />
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            marginBottom: 2,
            color: "#424242",
          }}
        >
          Verify your account{" "}
        </Text>
        <Text
          style={{
            marginBottom: 32,
            color: "#424242",
          }}
        >
          We sent a code to {email}
        </Text>

        <TextInput
          style={{
            width: "100%",
            borderWidth: 1,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderColor: "#D1D5DB",
            marginBottom: 16,
          }}
          placeholder="Enter Verification code"
          placeholderTextColor="#9CA3AF"
          keyboardType="number-pad"
          value={code}
          onChangeText={setCode}
        />
        {errors.fields.code && (
          <Text style={{ color: "#EF4444", marginBottom: 16 }}>
            {errors.fields.code.message}
          </Text>
        )}

        <TouchableOpacity
          onPress={onVerifyPress}
          disabled={isLoading}
          style={{
            backgroundColor: "#2563EB",
            paddingVertical: 16,
            marginBottom: 16,
            borderRadius: 14,
            alignItems: "center",
          }}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text
              style={{
                fontSize: 16,
                lineHeight: 24,
                fontWeight: "700",
                color: "#fff",
              }}
            >
              Verify
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => signUp.verifications.sendEmailCode()}
          style={{ paddingVertical: 6 }}
        >
          <Text style={{ color: "#2563EB" }}>I need a new code</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      style={{ backgroundColor: "#fff" }}
      keyboardShouldPersistTaps="handled"
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: 6,
          paddingVertical: 12,
          marginHorizontal: 10,
        }}
      >
        <Image
          source={require("../../assets/images/kribb.png")}
          style={{ width: 92, height: 62, marginBottom: 8 }}
          resizeMode="contain"
        />
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            marginBottom: 2,
            color: "#424242",
          }}
        >
          Create Account
        </Text>
        <Text
          style={{
            marginBottom: 32,
            color: "#424242",
          }}
        >
          Find your dream home today
        </Text>

        <View
          style={{
            flexDirection: "row",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderColor: "#D1D5DB",
            }}
            placeholder="First name"
            placeholderTextColor="#9CA3AF"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
          />
          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderColor: "#D1D5DB",
            }}
            placeholder="Last name"
            placeholderTextColor="#9CA3AF"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
          />
        </View>

        <TextInput
          style={{
            borderWidth: 1,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderColor: "#D1D5DB",
            marginBottom: 16,
          }}
          placeholder="Email address"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.fields.emailAddress && (
          <Text style={{ color: "#EF4444", marginBottom: 16 }}>
            {errors.fields.emailAddress.message}
          </Text>
        )}

        <TextInput
          style={{
            borderWidth: 1,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderColor: "#D1D5DB",
            marginBottom: 24,
          }}
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {errors.fields.password && (
          <Text style={{ color: "#EF4444", marginBottom: 16 }}>
            {errors.fields.password.message}
          </Text>
        )}

        <TouchableOpacity
          onPress={onSignUpPress}
          disabled={isLoading}
          style={{
            backgroundColor: "#2563EB",
            paddingVertical: 16,
            marginBottom: 16,
            borderRadius: 14,
            alignItems: "center",
          }}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text
              style={{
                fontSize: 16,
                lineHeight: 24,
                fontWeight: "700",
                color: "#fff",
              }}
            >
              Sign Up
            </Text>
          )}
        </TouchableOpacity>

        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Text style={{ color: "#6B7280" }}>Already have an account?</Text>
          <Link href="/sign-in">
            <Text style={{ fontWeight: "600", color: "#2563EB" }}>
              {" "}
              Sign In
            </Text>
          </Link>
        </View>
        <View nativeID="clerk-captcha" />
      </View>
    </ScrollView>
  );
}
