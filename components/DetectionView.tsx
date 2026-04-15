import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { WebView } from "react-native-webview";
import { DETECT_ENDPOINT } from "@/constants/api";

interface DetectionViewProps {
  youtubeUrl: string;
  onError?: (error: string) => void;
}

export default function DetectionView({ youtubeUrl, onError }: DetectionViewProps) {
  const streamUrl = `${DETECT_ENDPOINT}?url=${encodeURIComponent(youtubeUrl)}`;

  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <View style={styles.videoWrapper}>
          <img
            src={streamUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              borderRadius: 12,
              backgroundColor: '#e9ecef',
            }}
            alt="YOLO Detection Stream"
          />
        </View>
        <View style={styles.badge}>
          <View style={styles.liveIndicator} />
          <Text style={styles.liveText}>LIVE DETECTION</Text>
        </View>
      </View>
    );
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          background: #e9ecef; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          height: 100vh;
        }
        img { 
          width: 100%; 
          height: auto; 
          object-fit: contain; 
        }
      </style>
    </head>
    <body>
      <img src="${streamUrl}" alt="Detection" />
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <View style={styles.videoWrapper}>
        <WebView
          source={{ html }}
          style={styles.webview}
          javaScriptEnabled
          scrollEnabled={false}
          onError={() => onError?.("스트림 연결에 실패했습니다")}
        />
      </View>
      <View style={styles.badge}>
        <View style={styles.liveIndicator} />
        <Text style={styles.liveText}>LIVE DETECTION</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#e9ecef",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  videoWrapper: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
  badge: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF0000",
  },
  liveText: {
    color: "#1a1a1a",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
