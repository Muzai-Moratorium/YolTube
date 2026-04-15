import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function AboutScreen() {
	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<Text style={styles.title}>앱 정보</Text>

				<View style={styles.card}>
					<View style={styles.cardHeader}>
						<MaterialIcons name="auto-awesome" color="#FF0000" size={20} />
						<Text style={styles.cardTitle}>YOLTube</Text>
					</View>
					<Text style={styles.cardDesc}>저는 고양이가 좋아요</Text>
				</View>

				<View style={styles.card}>
					<View style={styles.cardHeader}>
						<MaterialIcons name="settings" color="#FF0000" size={20} />
						<Text style={styles.cardTitle}>시스템 스택</Text>
					</View>
					<View style={styles.techList}>
						<View style={styles.techItem}>
							<Text style={styles.techName}>Frontend</Text>
							<Text style={styles.techValue}>Expo / React Native</Text>
						</View>
						<View style={styles.techItem}>
							<Text style={styles.techName}>Backend</Text>
							<Text style={styles.techValue}>Python FastAPI</Text>
						</View>
					</View>
				</View>

				<View style={styles.card}>
					<View style={styles.cardHeader}>
						<MaterialIcons name="analytics" color="#FF0000" size={20} />
						<Text style={styles.cardTitle}>개발자 정보</Text>
					</View>
					<Text style={styles.cardDesc}>저는 고양이가 좋아요</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: "#ffffff",
	},
	scrollContent: {
		padding: 20,
		paddingTop: Platform.OS === "web" ? 40 : 60,
	},
	title: {
		fontSize: 28,
		fontWeight: "800",
		color: "#1a1a1a",
		marginBottom: 24,
	},
	card: {
		backgroundColor: "#f9f9f9",
		borderRadius: 24,
		padding: 24,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: "#f0f0f0",
	},
	cardHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
		gap: 8,
	},
	cardTitle: {
		fontSize: 18,
		fontWeight: "800",
		color: "#1a1a1a",
	},
	cardDesc: {
		fontSize: 14,
		color: "#606060",
		lineHeight: 22,
		fontWeight: "500",
	},
	techList: {
		gap: 12,
	},
	techItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	techName: {
		color: "#888",
		fontSize: 14,
		fontWeight: "600",
	},
	techValue: {
		color: "#FF0000",
		fontSize: 14,
		fontWeight: "700",
	},
});
