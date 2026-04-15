import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface DetectionStatsProps {
  isActive: boolean;
}

export default function DetectionStats({ isActive }: DetectionStatsProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setElapsed(0);
      return;
    }

    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!isActive) return null;

  return (
    <View style={styles.container}>
      <View style={styles.stat}>
        <MaterialIcons name="memory" color="#FF0000" size={20} />
        <View style={styles.statTextGroup}>
          <Text style={styles.statLabel}>AI 모델</Text>
          <Text style={styles.statValue}>YOLOv8n</Text>
        </View>
      </View>
      <View style={styles.stat}>
        <MaterialIcons name="person-search" color="#FF0000" size={20} />
        <View style={styles.statTextGroup}>
          <Text style={styles.statLabel}>탐지대상</Text>
          <Text style={styles.statValue}>사람</Text>
        </View>
      </View>
      <View style={styles.stat}>
        <MaterialIcons name="access-time" color="#FF0000" size={20} />
        <View style={styles.statTextGroup}>
          <Text style={styles.statLabel}>분석시간</Text>
          <Text style={styles.statValue}>{formatTime(elapsed)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#f9f9f9",
    borderRadius: 24,
    paddingVertical: 18,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  stat: {
    alignItems: "center",
    gap: 6,
  },
  statTextGroup: {
    alignItems: "center",
  },
  statLabel: {
    color: "#606060",
    fontSize: 11,
    fontWeight: "700",
  },
  statValue: {
    color: "#030303",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 2,
  },
});
