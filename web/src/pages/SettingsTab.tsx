import React, { useState } from "react";
import {
  User,
  Star,
  GraduationCap,
  Cake,
  Edit3,
  Volume2,
  Mic,
  ShieldCheck,
  Award,
  Info,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { FloatingShapes } from "../components/FloatingShapes";
import { ParentalGateModal } from "../components/ParentalGateModal";
import { ProfileEditModal } from "../components/ProfileEditModal";
import { useSettings } from "../context/SettingsContext";
import { useProgress } from "../hooks/useProgress";
import { resetAllProgress } from "../utils/storage";
import { playSound } from "../utils/audio";

export const SettingsTab: React.FC = () => {
  const {
    settings,
    toggleSound,
    toggleVoice,
    toggleParentLock,
  } = useSettings();

  const { totalStars, refreshProgress } = useProgress();

  const [parentalGateOpen, setParentalGateOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [gateContext, setGateContext] = useState<"profile" | "reset" | "lock">("profile");
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);

  const handleActionWithGate = (action: "profile" | "reset" | "lock") => {
    playSound("click");
    if (!settings.parentLockEnabled && action !== "lock") {
      if (action === "profile") {
        setProfileModalOpen(true);
      } else if (action === "reset") {
        setShowResetConfirm(true);
      }
      return;
    }

    setGateContext(action);
    setParentalGateOpen(true);
  };

  const onGateSuccess = () => {
    setParentalGateOpen(false);
    if (gateContext === "profile") {
      setProfileModalOpen(true);
    } else if (gateContext === "reset") {
      setShowResetConfirm(true);
    } else if (gateContext === "lock") {
      toggleParentLock();
    }
  };

  const handleConfirmReset = () => {
    resetAllProgress();
    refreshProgress();
    setShowResetConfirm(false);
    playSound("pop");
  };

  return (
    <div className="settings-tab-screen">
      <img
        src="./assets/images/background.png"
        alt="Background"
        className="app-bg-image"
      />
      <FloatingShapes />

      <div className="screen-scroll-view">
        {/* Header */}
        <header className="settings-header">
          <div className="settings-header-row">
            <div className="avatar-info-group">
              <div className="settings-avatar-pod">
                {settings.profile.image ? (
                  <img
                    src={settings.profile.image}
                    alt={settings.profile.name}
                    className="avatar-face-img"
                  />
                ) : (
                  <User size={30} color="#6C5CE7" />
                )}
              </div>

              <div className="user-greeting-text">
                <h1 className="greeting-heading">Parent's Corner</h1>
                <p className="greeting-sub">
                  {settings.profile.name || "Settings & Progress"}
                </p>
              </div>
            </div>

            <div className="score-pill-badge" title="Total Stars Earned">
              <Star size={18} fill="#FFD700" color="#FFD700" />
              <span className="score-number">{totalStars}</span>
            </div>
          </div>

          {/* Child Info Badges */}
          <div className="child-info-strip">
            <div className="child-badge-item">
              <GraduationCap size={16} color="#7C3AED" />
              <span>Class: {settings.profile.className || "Not set"}</span>
            </div>
            <div className="child-badge-item">
              <Cake size={16} color="#7C3AED" />
              <span>Age: {settings.profile.age || "Not set"}</span>
            </div>
          </div>
        </header>

        {/* Settings Sections */}
        <div className="settings-sections-wrapper">
          <div className="settings-columns-container">
            {/* Column 1: Profile & Preferences */}
            <div className="settings-column">
              {/* CHILD PROFILE */}
              <div className="section-header-title">CHILD PROFILE</div>
              <div className="settings-card-group">
                <div
                  className="setting-row-item btn-pressable"
                  onClick={() => handleActionWithGate("profile")}
                >
                  <div
                    className="setting-icon-box"
                    style={{ backgroundColor: "rgba(72, 52, 212, 0.12)" }}
                  >
                    <Edit3 size={20} color="#4834D4" />
                  </div>
                  <div className="setting-text-col">
                    <span className="setting-main-label">Edit Profile</span>
                    <span className="setting-sub-label">
                      Name, Age, Class & Photo
                    </span>
                  </div>
                  <ChevronRight size={20} color="#A0AEC0" />
                </div>
              </div>

              {/* PREFERENCES */}
              <div className="section-header-title">PREFERENCES</div>
              <div className="settings-card-group">
                {/* Sound Toggle */}
                <div className="setting-row-item border-b">
                  <div
                    className="setting-icon-box"
                    style={{ backgroundColor: "rgba(255, 118, 117, 0.12)" }}
                  >
                    <Volume2 size={20} color="#FF7675" />
                  </div>
                  <div className="setting-text-col">
                    <span className="setting-main-label">Sound Effects</span>
                    <span className="setting-sub-label">
                      Game sounds & UI clicks
                    </span>
                  </div>
                  <label className="switch-toggle">
                    <input
                      type="checkbox"
                      checked={settings.soundEnabled}
                      onChange={toggleSound}
                    />
                    <span className="switch-slider" />
                  </label>
                </div>

                {/* Voice Toggle */}
                <div className="setting-row-item">
                  <div
                    className="setting-icon-box"
                    style={{ backgroundColor: "rgba(108, 92, 231, 0.12)" }}
                  >
                    <Mic size={20} color="#6C5CE7" />
                  </div>
                  <div className="setting-text-col">
                    <span className="setting-main-label">Voice Guidance</span>
                    <span className="setting-sub-label">
                      Narrator voice for items
                    </span>
                  </div>
                  <label className="switch-toggle">
                    <input
                      type="checkbox"
                      checked={settings.voiceEnabled}
                      onChange={toggleVoice}
                    />
                    <span className="switch-slider" />
                  </label>
                </div>
              </div>
            </div>

            {/* Column 2: Security, About & Reset */}
            <div className="settings-column">
              {/* SECURITY & SUPPORT */}
              <div className="section-header-title">SECURITY & SUPPORT</div>
              <div className="settings-card-group">
                {/* Parental Lock Toggle */}
                <div className="setting-row-item border-b">
                  <div
                    className="setting-icon-box"
                    style={{ backgroundColor: "rgba(253, 203, 110, 0.16)" }}
                  >
                    <ShieldCheck size={20} color="#D97706" />
                  </div>
                  <div className="setting-text-col">
                    <span className="setting-main-label">Parental Lock</span>
                    <span className="setting-sub-label">
                      Math test for parent features
                    </span>
                  </div>
                  <label className="switch-toggle">
                    <input
                      type="checkbox"
                      checked={settings.parentLockEnabled}
                      onChange={() => handleActionWithGate("lock")}
                    />
                    <span className="switch-slider" />
                  </label>
                </div>

                {/* Rate Experience */}
                <div
                  className="setting-row-item border-b btn-pressable"
                  onClick={() => {
                    playSound("click");
                    setShowRateModal(true);
                  }}
                >
                  <div
                    className="setting-icon-box"
                    style={{ backgroundColor: "rgba(233, 30, 99, 0.12)" }}
                  >
                    <Award size={20} color="#E91E63" />
                  </div>
                  <div className="setting-text-col">
                    <span className="setting-main-label">Rate Experience</span>
                    <span className="setting-sub-label">Help us grow better</span>
                  </div>
                  <ChevronRight size={20} color="#A0AEC0" />
                </div>

                {/* About App */}
                <div
                  className="setting-row-item btn-pressable"
                  onClick={() => {
                    playSound("click");
                    setShowAboutModal(true);
                  }}
                >
                  <div
                    className="setting-icon-box"
                    style={{ backgroundColor: "rgba(162, 155, 254, 0.18)" }}
                  >
                    <Info size={20} color="#6C5CE7" />
                  </div>
                  <div className="setting-text-col">
                    <span className="setting-main-label">About Learning App</span>
                    <span className="setting-sub-label">Version 1.0.0 Web</span>
                  </div>
                  <ChevronRight size={20} color="#A0AEC0" />
                </div>
              </div>

              {/* DANGER ZONE - Reset Progress */}
              <div className="danger-card-wrapper">
                <button
                  onClick={() => handleActionWithGate("reset")}
                  className="danger-reset-btn btn-pressable"
                >
                  <Trash2 size={22} color="#FF5252" />
                  <div className="danger-text-col">
                    <span className="danger-title">Reset All Progress</span>
                    <span className="danger-sub">This will clear all learned items</span>
                  </div>
                  <ChevronRight size={20} color="#FF5252" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Parental Gate Modal */}
      <ParentalGateModal
        isOpen={parentalGateOpen}
        onSuccess={onGateSuccess}
        onClose={() => setParentalGateOpen(false)}
      />

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      {/* About Modal */}
      {showAboutModal && (
        <div className="modal-overlay">
          <div className="modal-content-card">
            <div className="about-icon-pod">
              <img
                src="./assets/images/AppIcon.png"
                alt="App Icon"
                className="about-icon-img"
              />
            </div>
            <h3 className="about-app-name">Little Learner</h3>
            <p className="about-app-version">Version 1.0.0 (Web Edition)</p>
            <p className="about-app-desc">
              A fun and interactive early learning platform for kids featuring ABC,
              Numbers, Animals, Solar System, Shapes, Drawing, and playful Educational Games.
            </p>
            <button
              onClick={() => setShowAboutModal(false)}
              className="btn-modal-close btn-pressable"
            >
              Awesome!
            </button>
          </div>
        </div>
      )}

      {/* Rate Modal */}
      {showRateModal && (
        <div className="modal-overlay">
          <div className="modal-content-card">
            <h3 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "8px" }}>
              Enjoying Little Learner? ⭐
            </h3>
            <p style={{ fontSize: "14px", color: "#636E72", marginBottom: "20px" }}>
              Give our GitHub project a star to help other parents and kids discover it!
            </p>
            <button
              onClick={() => setShowRateModal(false)}
              className="btn-modal-close btn-pressable"
            >
              Thank You! 🌟
            </button>
          </div>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="modal-overlay">
          <div className="modal-content-card reset-confirm-card">
            <Trash2 size={40} color="#FF5252" style={{ margin: "0 auto 12px auto" }} />
            <h3 style={{ fontSize: "20px", fontWeight: "900", color: "#1F2937", marginBottom: "8px" }}>
              Reset All Progress?
            </h3>
            <p style={{ fontSize: "14px", color: "#4A5568", marginBottom: "20px", lineHeight: "1.4" }}>
              Are you sure you want to clear all learning achievements and stars? This cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="btn-pressable"
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "16px",
                  background: "#F1F3F9",
                  fontWeight: "700",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="btn-pressable"
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "16px",
                  background: "#FF5252",
                  color: "white",
                  fontWeight: "800",
                }}
              >
                Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .settings-tab-screen {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .settings-header {
          padding: 24px 20px 16px 20px;
          position: relative;
          z-index: 10;
        }

        .settings-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 16px;
        }

        .avatar-info-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .settings-avatar-pod {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: #E0E7FF;
          border: 2.5px solid #EEF2FF;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }

        .avatar-face-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .child-info-strip {
          display: flex;
          align-items: center;
          justify-content: space-around;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border-radius: 24px;
          padding: 10px 16px;
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
        }

        .child-badge-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13.5px;
          font-weight: 800;
          color: #7C3AED;
          background: rgba(124, 58, 237, 0.08);
          padding: 6px 14px;
          border-radius: 20px;
        }

        .settings-sections-wrapper {
          padding: 10px 18px 30px 18px;
        }

        .settings-columns-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .wide-mode .settings-columns-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          align-items: start;
        }

        .section-header-title {
          font-size: 12.5px;
          font-weight: 800;
          color: #495057;
          letter-spacing: 1.2px;
          margin: 12px 0 6px 8px;
        }

        .settings-card-group {
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(0, 0, 0, 0.04);
        }

        .setting-row-item {
          display: flex;
          align-items: center;
          padding: 14px 18px;
          gap: 14px;
          cursor: pointer;
        }

        .setting-row-item.border-b {
          border-bottom: 1px solid #F1F3F5;
        }

        .setting-icon-box {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .setting-text-col {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .setting-main-label {
          font-size: 16px;
          font-weight: 700;
          color: #212529;
        }

        .setting-sub-label {
          font-size: 12.5px;
          color: #868E96;
          margin-top: 1px;
        }

        .switch-toggle {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 28px;
          flex-shrink: 0;
        }

        .switch-toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .switch-slider {
          position: absolute;
          cursor: pointer;
          inset: 0;
          background-color: #E2E8F0;
          transition: 0.25s;
          border-radius: 34px;
        }

        .switch-slider:before {
          position: absolute;
          content: "";
          height: 22px;
          width: 22px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.25s;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        input:checked + .switch-slider {
          background-color: #6C5CE7;
        }

        input:checked + .switch-slider:before {
          transform: translateX(20px);
        }

        .danger-card-wrapper {
          margin-top: 24px;
        }

        .danger-reset-btn {
          width: 100%;
          background: #FFF5F5;
          border: 1.5px solid #FFE3E3;
          border-radius: 24px;
          padding: 16px 18px;
          display: flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
          text-align: left;
        }

        .danger-text-col {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .danger-title {
          font-size: 16px;
          font-weight: 800;
          color: #FF5252;
        }

        .danger-sub {
          font-size: 12px;
          color: #E03131;
          opacity: 0.8;
          margin-top: 1px;
        }

        .about-icon-pod {
          width: 72px;
          height: 72px;
          border-radius: 20px;
          overflow: hidden;
          margin: 0 auto 12px auto;
          box-shadow: 0 6px 16px rgba(108, 92, 231, 0.25);
        }

        .about-icon-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .about-app-name {
          font-size: 22px;
          font-weight: 900;
          color: #1F2937;
        }

        .about-app-version {
          font-size: 13px;
          color: #6C5CE7;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .about-app-desc {
          font-size: 14px;
          color: #4A5568;
          line-height: 1.5;
          margin-bottom: 20px;
        }

        .btn-modal-close {
          width: 100%;
          padding: 12px;
          border-radius: 16px;
          background: #6C5CE7;
          color: white;
          font-weight: 800;
          font-size: 15px;
        }
      `}</style>
    </div>
  );
};
