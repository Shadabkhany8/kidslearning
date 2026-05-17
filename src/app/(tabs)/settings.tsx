import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  SlideInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
// import { SafeAreaView } from "react-native-safe-area-context";
import FloatingShapes from "../../components/FloatingShapes";
import { COLORS } from "../../constants/data";
import { useSettings } from "../../context/SettingsContext";
import { useProgress } from "../../hooks/useProgress";
import { resetAllProgress } from "../../utils/storage";

const SettingItem = ({
  icon,
  title,
  subtitle,
  color,
  rightElement,
  onPress,
  isLast = false,
}: any) => (
  <TouchableOpacity
    style={[styles.settingItem, !isLast && styles.borderBottom]}
    onPress={onPress}
    disabled={!onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.iconContainer, { backgroundColor: color + "15" }]}>
      <MaterialCommunityIcons name={icon} size={22} color={color} />
    </View>
    <View style={styles.settingText}>
      <Text style={styles.settingTitle}>{title}</Text>
      <Text style={styles.settingSubtitle}>{subtitle}</Text>
    </View>
    {rightElement ? (
      rightElement
    ) : (
      <MaterialCommunityIcons name="chevron-right" size={24} color="#BBB" />
    )}
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const {
    settings,
    toggleSound,
    toggleVoice,
    toggleParentLock,
    updateProfile,
  } = useSettings();
  const { totalStars } = useProgress();
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [parentalGateVisible, setParentalGateVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [gateContext, setGateContext] = useState<
    "settings" | "reset" | "profile"
  >("settings");
  const [mathProblem, setMathProblem] = useState({ n1: 0, n2: 0, ans: 0 });
  const [userAns, setUserAns] = useState("");

  const [tempProfile, setTempProfile] = useState(settings.profile);

  // Header animations
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);

  useEffect(() => {
    titleOpacity.value = withTiming(1, { duration: 800 });
    titleTranslateY.value = withSpring(0, { damping: 12, stiffness: 90 });
  }, [titleOpacity, titleTranslateY]);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const headerStyle = useAnimatedStyle(() => ({
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 25,
  }));

  useEffect(() => {
    setTempProfile(settings.profile);
  }, [settings.profile]);

  useEffect(() => {
    if (settings.parentLockEnabled && !isAuthenticated) {
      openParentalGate("settings");
    }
  }, [settings.parentLockEnabled]);

  const generateMathProblem = () => {
    const n1 = Math.floor(Math.random() * 9) + 2;
    const n2 = Math.floor(Math.random() * 9) + 2;
    setMathProblem({ n1, n2, ans: n1 + n2 });
    setUserAns("");
  };

  const openParentalGate = (context: "settings" | "reset" | "profile") => {
    if (!settings.parentLockEnabled && context !== "settings") {
      if (context === "profile") {
        setProfileModalVisible(true);
      } else if (context === "reset") {
        handleGateSuccessDirectly("reset");
      }
      return;
    }

    if (isAuthenticated && context === "settings") {
      return;
    }

    setGateContext(context);
    generateMathProblem();
    setParentalGateVisible(true);
  };

  const handleGateSuccessDirectly = (
    context: "settings" | "reset" | "profile",
  ) => {
    if (context === "reset") {
      Alert.alert(
        "Reset Progress",
        "Are you absolutely sure you want to clear all your learning progress? This cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Reset Everything",
            style: "destructive",
            onPress: async () => {
              await resetAllProgress();
              Alert.alert("Reset", "All progress has been cleared.");
            },
          },
        ],
      );
    }
  };

  const handleGateSuccess = async () => {
    if (parseInt(userAns) === mathProblem.ans) {
      setParentalGateVisible(false);
      setIsAuthenticated(true);
      if (gateContext === "reset") {
        Alert.alert(
          "Reset Progress",
          "Are you absolutely sure you want to clear all your learning progress? This cannot be undone.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Reset Everything",
              style: "destructive",
              onPress: async () => {
                await resetAllProgress();
                Alert.alert("Reset", "All progress has been cleared.");
              },
            },
          ],
        );
      } else if (gateContext === "profile") {
        setProfileModalVisible(true);
      } else {
        // Generic success for settings access if needed in future
        // Alert.alert("Success", "Access granted to Parent Settings!");
      }
    } else {
      Alert.alert("Oops!", "Wrong answer. Please try again or ask a parent!");
      generateMathProblem();
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setTempProfile({ ...tempProfile, image: result.assets[0].uri });
    }
  };

  const saveProfile = () => {
    updateProfile(tempProfile);
    setProfileModalVisible(false);
    Alert.alert("Success", "Profile updated successfully!");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ImageBackground
        source={require("../../../assets/images/background.png")}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />
      <FloatingShapes />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.headerWrapper}>
          <Animated.View style={headerStyle}>
            <View style={styles.headerTop}>
              <View style={styles.userRow}>
                <View
                  style={[
                    styles.avatarWrapper,
                    { backgroundColor: "#E0E7FF", borderColor: "#EEF2FF" },
                  ]}
                >
                  {settings.profile.image ? (
                    <Image
                      source={{ uri: settings.profile.image }}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="account-cog"
                      size={32}
                      color="#6C5CE7"
                    />
                  )}
                </View>

                <Animated.View style={[titleStyle, { marginLeft: 12 }]}>
                  <Text style={styles.welcomeText}>Parent&apos;s Corner</Text>
                  <Text style={styles.subtitle}>
                    {settings.profile.name || "Settings & Progress"}
                  </Text>
                </Animated.View>
              </View>

              <View style={styles.scoreBadge}>
                <MaterialCommunityIcons name="star" size={18} color="gold" />
                <Text style={styles.scoreText}>{totalStars}</Text>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.profileInfoRow}>
                <View style={styles.infoBadge}>
                  <MaterialCommunityIcons
                    name="school"
                    size={16}
                    color="#7C3AED"
                  />
                  <Text style={styles.infoText}>
                    Class: {settings.profile.className || "Not set"}
                  </Text>
                </View>
                <View style={styles.infoBadge}>
                  <MaterialCommunityIcons
                    name="cake-variant"
                    size={16}
                    color="#7C3AED"
                  />
                  <Text style={styles.infoText}>
                    Age: {settings.profile.age || "Not set"}
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>
        </View>

        <View style={styles.content}>
          <Animated.Text
            entering={FadeInDown.delay(200)}
            style={styles.sectionTitle}
          >
            CHILD PROFILE
          </Animated.Text>
          <Animated.View entering={FadeInDown.delay(250)} style={styles.card}>
            <SettingItem
              icon="account-edit"
              title="Edit Profile"
              subtitle="Name, Age, Class & Photo"
              color="#4834D4"
              isLast={true}
              onPress={() => openParentalGate("profile")}
            />
          </Animated.View>

          <Animated.Text
            entering={FadeInDown.delay(300)}
            style={styles.sectionTitle}
          >
            PREFERENCES
          </Animated.Text>
          <Animated.View entering={FadeInDown.delay(350)} style={styles.card}>
            <SettingItem
              icon="volume-high"
              title="Sound Effects"
              subtitle="Game sounds & UI clicks"
              color="#FF7675"
              rightElement={
                <Switch
                  value={settings.soundEnabled}
                  onValueChange={toggleSound}
                  trackColor={{ false: "#EEE", true: "#FF7675" }}
                  thumbColor={
                    Platform.OS === "ios"
                      ? "#FFF"
                      : settings.soundEnabled
                        ? "#FF7675"
                        : "#f4f3f4"
                  }
                />
              }
            />
            <SettingItem
              icon="microphone"
              title="Voice Guidance"
              subtitle="Narrator voice for items"
              color="#6C5CE7"
              isLast={true}
              rightElement={
                <Switch
                  value={settings.voiceEnabled}
                  onValueChange={toggleVoice}
                  trackColor={{ false: "#EEE", true: "#6C5CE7" }}
                  thumbColor={
                    Platform.OS === "ios"
                      ? "#FFF"
                      : settings.voiceEnabled
                        ? "#6C5CE7"
                        : "#f4f3f4"
                  }
                />
              }
            />
          </Animated.View>

          <Animated.Text
            entering={FadeInDown.delay(400)}
            style={styles.sectionTitle}
          >
            SECURITY & SUPPORT
          </Animated.Text>
          <Animated.View entering={FadeInDown.delay(500)} style={styles.card}>
            <SettingItem
              icon="shield-lock"
              title="Parental Lock"
              subtitle="Math test for settings access"
              color="#FDCB6E"
              rightElement={
                <Switch
                  value={settings.parentLockEnabled}
                  onValueChange={toggleParentLock}
                  trackColor={{ false: "#EEE", true: "#FDCB6E" }}
                  thumbColor={
                    Platform.OS === "ios"
                      ? "#FFF"
                      : settings.parentLockEnabled
                        ? "#FDCB6E"
                        : "#f4f3f4"
                  }
                />
              }
            />
            <SettingItem
              icon="star-circle"
              title="Rate Experience"
              subtitle="Help us grow better"
              color="#E91E63"
              onPress={() =>
                Alert.alert(
                  "Coming Soon",
                  "App Store rating link will be added!",
                )
              }
            />
            <SettingItem
              icon="information-outline"
              title="About Learning App"
              subtitle="Version 1.0.0 (BETA)"
              color="#A29BFE"
              isLast={true}
              onPress={() =>
                Alert.alert(
                  "About",
                  "A fun and interactive learning platform for kids.",
                )
              }
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(600)}
            style={styles.dangerCard}
          >
            <TouchableOpacity
              style={styles.dangerButton}
              onPress={() => openParentalGate("reset")}
            >
              <MaterialCommunityIcons
                name="delete-restore"
                size={24}
                color="#FF5252"
              />
              <View style={styles.dangerTextContainer}>
                <Text style={styles.dangerTitle}>Reset All Progress</Text>
                <Text style={styles.dangerSubtitle}>
                  This will clear all learned items
                </Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color="#FF5252"
              />
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Parental Gate Modal */}
      <Modal
        visible={parentalGateVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setParentalGateVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View entering={FadeInDown} style={styles.gateContent}>
            <View style={styles.gateHeader}>
              <View style={styles.lockCircle}>
                <MaterialCommunityIcons
                  name="shield-lock"
                  size={30}
                  color={COLORS.primary}
                />
              </View>
              <Text style={styles.gateTitle}>Parental Gate</Text>
              <Text style={styles.gateSubtitle}>
                Please solve this simple math problem to prove you are a parent!
              </Text>
            </View>

            <View style={styles.mathContainer}>
              <Text style={styles.mathText}>
                {mathProblem.n1} + {mathProblem.n2} = ?
              </Text>
              <TextInput
                style={styles.mathInput}
                keyboardType="number-pad"
                placeholder="Answer"
                value={userAns}
                onChangeText={setUserAns}
                autoFocus={true}
                maxLength={3}
              />
            </View>

            <View style={styles.gateButtons}>
              <TouchableOpacity
                style={styles.gateCancelButton}
                onPress={() => setParentalGateVisible(false)}
              >
                <Text style={styles.gateCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.gateOkButton}
                onPress={handleGateSuccess}
              >
                <Text style={styles.gateOkText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Profile Edit Modal */}
      <Modal
        visible={profileModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={styles.bottomSheetOverlay}>
          <TouchableOpacity
            style={styles.bottomSheetBackdrop}
            activeOpacity={1}
            onPress={() => setProfileModalVisible(false)}
          />
          <Animated.View
            entering={SlideInDown}
            style={styles.bottomSheetContent}
          >
            <View style={styles.bottomSheetIndicator} />
            <Text style={styles.bottomSheetTitle}>Edit Child Profile</Text>

            <ScrollView style={styles.profileForm}>
              <View style={styles.profileImageSection}>
                <TouchableOpacity
                  onPress={pickImage}
                  style={styles.imagePickerButton}
                >
                  {tempProfile.image ? (
                    <Image
                      source={{ uri: tempProfile.image }}
                      style={styles.profileImagePreview}
                    />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <MaterialCommunityIcons
                        name="camera-plus"
                        size={40}
                        color="#AAA"
                      />
                      <Text style={styles.imagePlaceholderText}>Add Photo</Text>
                    </View>
                  )}
                  <View style={styles.editBadge}>
                    <MaterialCommunityIcons
                      name="pencil"
                      size={16}
                      color="white"
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Child&apos;s Name</Text>
                <View style={styles.inputWrapper}>
                  <MaterialCommunityIcons
                    name="account"
                    size={20}
                    color={COLORS.primary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter name"
                    value={tempProfile.name}
                    onChangeText={(text) =>
                      setTempProfile({ ...tempProfile, name: text })
                    }
                  />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.inputLabel}>Age</Text>
                  <View style={styles.inputWrapper}>
                    <MaterialCommunityIcons
                      name="cake"
                      size={20}
                      color={COLORS.primary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Age"
                      keyboardType="number-pad"
                      value={tempProfile.age}
                      onChangeText={(text) =>
                        setTempProfile({ ...tempProfile, age: text })
                      }
                    />
                  </View>
                </View>
                <View style={[styles.inputGroup, { flex: 2 }]}>
                  <Text style={styles.inputLabel}>Class / Grade</Text>
                  <View style={styles.inputWrapper}>
                    <MaterialCommunityIcons
                      name="school"
                      size={20}
                      color={COLORS.primary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder="e.g. Nursery, KG, 1st"
                      value={tempProfile.className}
                      onChangeText={(text) =>
                        setTempProfile({ ...tempProfile, className: text })
                      }
                    />
                  </View>
                </View>
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
                <LinearGradient
                  colors={[COLORS.primary, COLORS.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.saveButtonGradient}
                >
                  <Text style={styles.saveButtonText}>Save Profile</Text>
                </LinearGradient>
              </TouchableOpacity>
              <View style={{ height: 30 }} />
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerWrapper: {
    position: "relative",
    marginBottom: 10,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E0E7FF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#EEF2FF",
    position: "relative",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  welcomeText: {
    fontSize: 22,
    color: "#1F2937",
    fontWeight: "900",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
  },
  scoreBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6C5CE7",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 25,
    gap: 6,
  },
  scoreText: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
  },
  progressContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    marginHorizontal: 0,
    marginTop: 30,
    padding: 20,
    borderRadius: 35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(243, 244, 246, 0.5)",
  },
  profileInfoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
  },
  infoBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(124, 58, 237, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.2)",
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#7C3AED",
  },
  content: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#495057",
    marginBottom: 12,
    marginLeft: 8,
    letterSpacing: 1.5,
    marginTop: 10,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 24,
    paddingVertical: 4,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 16,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F3F5",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#212529",
  },
  settingSubtitle: {
    fontSize: 13,
    color: "#868E96",
    marginTop: 2,
  },
  dangerCard: {
    backgroundColor: "#FFF5F5",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#FFE3E3",
    marginTop: 20,
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    gap: 16,
  },
  dangerTextContainer: {
    flex: 1,
  },
  dangerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FF5252",
  },
  dangerSubtitle: {
    fontSize: 13,
    color: "#FF8E8E",
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },
  gateContent: {
    backgroundColor: "white",
    borderRadius: 30,
    padding: 30,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  gateHeader: {
    alignItems: "center",
    marginBottom: 25,
  },
  lockCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  gateTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#212529",
    marginBottom: 8,
  },
  gateSubtitle: {
    fontSize: 14,
    color: "#868E96",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  mathContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 20,
    borderRadius: 20,
    width: "100%",
    marginBottom: 25,
    gap: 15,
  },
  mathText: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.primary,
    flex: 1,
    textAlign: "center",
  },
  mathInput: {
    backgroundColor: "white",
    flex: 1,
    height: 55,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#E9ECEF",
    textAlign: "center",
    fontSize: 22,
    fontWeight: "800",
    color: "#212529",
  },
  gateButtons: {
    flexDirection: "row",
    gap: 15,
    width: "100%",
  },
  gateCancelButton: {
    flex: 1,
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1F3F5",
  },
  gateCancelText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#868E96",
  },
  gateOkButton: {
    flex: 2,
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
  gateOkText: {
    fontSize: 16,
    fontWeight: "800",
    color: "white",
  },
  bottomSheetOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  bottomSheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  bottomSheetContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingTop: 15,
    paddingHorizontal: 25,
    paddingBottom: Platform.OS === "ios" ? 40 : 25,
    maxHeight: "90%",
  },
  bottomSheetIndicator: {
    width: 40,
    height: 5,
    backgroundColor: "#E9ECEF",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 25,
  },
  bottomSheetTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#212529",
    marginBottom: 25,
    textAlign: "center",
  },
  profileForm: {
    width: "100%",
  },
  profileImageSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  imagePickerButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E9ECEF",
    borderStyle: "dashed",
    position: "relative",
  },
  profileImagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  imagePlaceholder: {
    alignItems: "center",
  },
  imagePlaceholderText: {
    fontSize: 12,
    color: "#ADB5BD",
    marginTop: 5,
    fontWeight: "700",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#495057",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E9ECEF",
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    height: 55,
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
  },
  inputRow: {
    flexDirection: "row",
    width: "100%",
  },
  saveButton: {
    marginTop: 10,
    marginBottom: 20,
  },
  saveButtonGradient: {
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
});
