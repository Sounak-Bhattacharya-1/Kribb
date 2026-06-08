import { useSignIn } from "@clerk/expo";
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

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const isLoading = fetchStatus === "fetching";

  const onSignInPress = async () => {
    const { error } = await signIn.password({
      emailAddress: email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }
          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    } else if (signIn.status === "needs_second_factor") {
      await signIn.mfa.sendPhoneCode();
    } else if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );

      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
    } else {
      console.error("Sign-in attempt not complete:", signIn);
    }
  };

  const onVerifyPress = async () => {
    await signIn.mfa.verifyEmailCode({
      code,
    });

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }
          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    }
  };

  if (signIn?.status === "needs_client_trust") {
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
          onPress={() => signIn.mfa.sendEmailCode()}
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
          Welcome back
        </Text>
        <Text
          style={{
            marginBottom: 32,
            color: "#424242",
          }}
        >
          Sign in to your account
        </Text>

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
        {errors.fields.identifier && (
          <Text style={{ color: "#EF4444", marginBottom: 16 }}>
            {errors.fields.identifier.message}
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
          onPress={onSignInPress}
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
              Sign In
            </Text>
          )}
        </TouchableOpacity>

        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Text style={{ color: "#6B7280" }}>Don&apos;t have an account?</Text>
          <Link href="/sign-up">
            <Text style={{ fontWeight: "600", color: "#2563EB" }}>
              {" "}
              Sign Up
            </Text>
          </Link>
        </View>

        <View nativeID="clerk-captcha" />
      </View>
    </ScrollView>
  );
}
