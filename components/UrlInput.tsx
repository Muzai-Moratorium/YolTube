import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export default function UrlInput({ onSubmit, isLoading }: UrlInputProps) {
  const [url, setUrl] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const scaleAnim = useState(new Animated.Value(1))[0];

  const isValidUrl = (text: string) => {
    return (
      text.includes("youtube.com/watch") ||
      text.includes("youtu.be/") ||
      text.includes("youtube.com/shorts")
    );
  };

  const handleSubmit = () => {
    if (!isValidUrl(url) || isLoading) return;

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onSubmit(url);
  };

  const valid = isValidUrl(url);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
        ]}
      >
        <MaterialIcons name="search" color={isFocused ? "#FF0000" : "#606060"} size={22} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="유튜브 영상 주소를 입력하세요"
          placeholderTextColor="#909090"
          value={url}
          onChangeText={setUrl}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          editable={!isLoading}
          cursorColor="#FF0000"
        />
        {url.length > 0 && (
          <TouchableOpacity onPress={() => setUrl("")} style={styles.clearBtn}>
            <MaterialIcons name="close" color="#606060" size={20} />
          </TouchableOpacity>
        )}
      </View>

      <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '100%' }}>
        <TouchableOpacity
          style={[
            styles.button,
            (!valid || isLoading) && styles.buttonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!valid || isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <MaterialIcons name="play-arrow" color="#fff" size={24} />
              <Text style={styles.buttonText}>지금 영상 분석하기</Text>
            </>
          )}
        </TouchableOpacity>
      </Animated.View>
      {url.length > 0 && !valid && (
        <Text style={styles.errorText}>올바른 유튜브 주소 형식이 아닙니다.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "transparent",
    paddingHorizontal: 20,
    height: 54,
  },
  inputWrapperFocused: {
    backgroundColor: "#ffffff",
    borderColor: "#FF0000",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#0f0f0f",
    fontSize: 16,
    height: "100%",
    fontWeight: '500',
  },
  clearBtn: {
    padding: 4,
  },
  errorText: {
    color: "#FF0000",
    fontSize: 13,
    marginTop: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF0000",
    borderRadius: 40,
    height: 56,
    marginTop: 16,
    gap: 6,
  },
  buttonDisabled: {
    backgroundColor: "#e5e5e5",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
});
