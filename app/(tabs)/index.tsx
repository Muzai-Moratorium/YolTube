import DetectionStats from "@/components/DetectionStats";
import DetectionView from "@/components/DetectionView";
import UrlInput from "@/components/UrlInput";
import { HEALTH_ENDPOINT } from "@/constants/api";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import {
	Animated,
	Dimensions,
	Platform,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

type AppState = "idle" | "loading" | "detecting" | "error";

export default function HomeScreen() {
	const [appState, setAppState] = useState<AppState>("idle");
	const [currentUrl, setCurrentUrl] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const fadeAnim = useState(new Animated.Value(0))[0];

	const handleSubmit = useCallback(
		async (url: string) => {
			setAppState("loading");
			setErrorMsg("");

			try {
				const healthRes = await fetch(HEALTH_ENDPOINT);
				if (!healthRes.ok) throw new Error("서버 연결 실패");

				setCurrentUrl(url);
				setAppState("detecting");

				Animated.timing(fadeAnim, {
					toValue: 1,
					duration: 500,
					useNativeDriver: true,
				}).start();
			} catch {
				setAppState("error");
				setErrorMsg(
					"서버에 연결할 수 없습니다. Python 서버가 실행 중인지 확인하세요.",
				);
			}
		},
		[fadeAnim],
	);

	const handleStop = () => {
		Animated.timing(fadeAnim, {
			toValue: 0,
			duration: 300,
			useNativeDriver: true,
		}).start(() => {
			setAppState("idle");
			setCurrentUrl("");
		});
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.navbar}>
				<View style={styles.logoContainer}>
					<FontAwesome name="youtube-play" size={32} color="#FF0000" />
					<Text style={styles.logoText}>YOL<Text style={styles.logoTube}>Tube</Text></Text>
				</View>
				<TouchableOpacity style={styles.profileBtn}>
					<MaterialIcons name="account-circle" size={32} color="#606060" />
				</TouchableOpacity>
			</View>

			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{appState !== "detecting" && (
					<View style={styles.welcomeSection}>
						<Text style={styles.welcomeTitle}>무엇을 탐지해드릴까요?</Text>
						<Text style={styles.welcomeSubtitle}>유튜브 링크만 넣으면 AI가 사람을 찾아내요!</Text>
					</View>
				)}

				{appState !== "detecting" && (
					<UrlInput
						onSubmit={handleSubmit}
						isLoading={appState === "loading"}
					/>
				)}

				{appState === "error" && (
					<View style={styles.errorCard}>
						<MaterialIcons name="error-outline" size={40} color="#FF0000" />
						<Text style={styles.errorText}>{errorMsg}</Text>
						<TouchableOpacity
							style={styles.retryBtn}
							onPress={() => setAppState("idle")}
						>
							<Text style={styles.retryText}>다시 시도하기</Text>
						</TouchableOpacity>
					</View>
				)}

				{appState === "detecting" && currentUrl && (
					<Animated.View style={[styles.detectionArea, { opacity: fadeAnim }]}>
						<View style={styles.detectionContainer}>
							<DetectionView
								youtubeUrl={currentUrl}
								onError={(err) => {
									setAppState("error");
									setErrorMsg(err);
								}}
							/>
							<DetectionStats isActive={true} />
						</View>

						<TouchableOpacity
							style={styles.stopButton}
							onPress={handleStop}
							activeOpacity={0.8}
						>
							<MaterialIcons name="stop-circle" size={24} color="#ffffff" />
							<Text style={styles.stopText}>분석 중단하기</Text>
						</TouchableOpacity>
					</Animated.View>
				)}

				{appState === "idle" && (
					<View style={styles.guideSection}>
						<Text style={styles.guideHeader}>간편 가이드</Text>
						<View style={styles.guideGrid}>
							<View style={styles.guideItem}>
								<MaterialIcons name="computer" size={24} color="#FF0000" />
								<Text style={styles.guideText}>1. 서버 켜기</Text>
							</View>
							<View style={styles.guideItem}>
								<MaterialIcons name="link" size={24} color="#FF0000" />
								<Text style={styles.guideText}>2. 링크 붙이기</Text>
							</View>
							<View style={styles.guideItem}>
								<MaterialIcons name="face" size={24} color="#FF0000" />
								<Text style={styles.guideText}>3. 사람 찾기!</Text>
							</View>
						</View>
					</View>
				)}
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: "#ffffff",
	},
	navbar: {
		height: 60,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
		backgroundColor: '#ffffff',
		borderBottomWidth: 1,
		borderBottomColor: '#f2f2f2',
	},
	logoContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	},
	logoText: {
		fontSize: 22,
		fontWeight: "900",
		color: "#000",
		letterSpacing: -1,
	},
	logoTube: {
		color: "#1a1a1a",
		fontWeight: "600",
	},
	profileBtn: {
		padding: 5,
	},
	scrollContent: {
		padding: 20,
		alignItems: "center",
	},
	welcomeSection: {
		width: '100%',
		marginBottom: 20,
		marginTop: 10,
	},
	welcomeTitle: {
		fontSize: 24,
		fontWeight: '800',
		color: '#030303',
	},
	welcomeSubtitle: {
		fontSize: 15,
		color: '#606060',
		marginTop: 4,
	},
	detectionArea: {
		width: "100%",
		maxWidth: 900,
	},
	detectionContainer: {
		width: "100%",
	},
	errorCard: {
		alignItems: "center",
		backgroundColor: "#fff5f5",
		borderRadius: 24,
		padding: 30,
		marginTop: 20,
		width: "100%",
		borderWidth: 1,
		borderColor: '#ffebeb',
	},
	errorText: {
		color: "#FF0000",
		fontSize: 15,
		textAlign: "center",
		marginTop: 12,
		fontWeight: '500',
	},
	retryBtn: {
		marginTop: 20,
		paddingHorizontal: 30,
		paddingVertical: 12,
		borderRadius: 30,
		backgroundColor: "#FF0000",
	},
	retryText: {
		color: "#fff",
		fontWeight: "700",
		fontSize: 15,
	},
	stopButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#030303",
		borderRadius: 30,
		height: 56,
		marginTop: 20,
		gap: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 10,
		elevation: 5,
	},
	stopText: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "700",
	},
	guideSection: {
		marginTop: 40,
		width: "100%",
		backgroundColor: '#f9f9f9',
		padding: 24,
		borderRadius: 24,
	},
	guideHeader: {
		color: "#030303",
		fontSize: 18,
		fontWeight: "800",
		marginBottom: 20,
		textAlign: 'center',
	},
	guideGrid: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	guideItem: {
		alignItems: 'center',
		gap: 8,
	},
	guideText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#606060',
	},
});
