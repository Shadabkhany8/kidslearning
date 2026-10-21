import React, { useState, useRef } from "react";
import { Camera, User, Cake, GraduationCap, X, Check } from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import { playSound } from "../utils/audio";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { settings, updateProfile } = useSettings();
  const [formData, setFormData] = useState(settings.profile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setFormData((prev) => ({ ...prev, image: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    playSound("correct");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-card profile-edit-modal">
        <button
          onClick={onClose}
          className="modal-close-icon-btn"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h3 className="profile-edit-title">Edit Child Profile</h3>

        <form onSubmit={handleSave}>
          {/* Avatar Picture Picker */}
          <div className="avatar-pick-container">
            <div
              className="avatar-preview-pod"
              onClick={() => fileInputRef.current?.click()}
              title="Click to change photo"
            >
              {formData.image ? (
                <img
                  src={formData.image}
                  alt="Avatar"
                  className="avatar-preview-img"
                />
              ) : (
                <div className="avatar-placeholder">
                  <Camera size={34} color="#A29BFE" />
                  <span className="add-photo-text">Add Photo</span>
                </div>
              )}
              <div className="camera-badge">
                <Camera size={14} color="white" />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </div>

          {/* Child Name */}
          <div className="input-group">
            <label className="input-field-label">Child's Name</label>
            <div className="input-field-wrapper">
              <User size={18} className="field-icon" color="#6C5CE7" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Leo, Maya"
                className="text-input-field"
                required
              />
            </div>
          </div>

          {/* Age & Class Row */}
          <div className="input-row-flex">
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-field-label">Age</label>
              <div className="input-field-wrapper">
                <Cake size={18} className="field-icon" color="#6C5CE7" />
                <input
                  type="text"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  placeholder="e.g. 5"
                  className="text-input-field"
                />
              </div>
            </div>

            <div className="input-group" style={{ flex: 1.5 }}>
              <label className="input-field-label">Class / Grade</label>
              <div className="input-field-wrapper">
                <GraduationCap
                  size={18}
                  className="field-icon"
                  color="#6C5CE7"
                />
                <input
                  type="text"
                  value={formData.className}
                  onChange={(e) =>
                    setFormData({ ...formData, className: e.target.value })
                  }
                  placeholder="e.g. KG, 1st"
                  className="text-input-field"
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-save-profile btn-pressable">
            <Check size={18} strokeWidth={3} />
            <span>Save Profile</span>
          </button>
        </form>
      </div>

      <style>{`
        .profile-edit-modal {
          max-width: 400px;
        }

        .profile-edit-title {
          font-size: 20px;
          font-weight: 800;
          color: #2D3436;
          margin-bottom: 20px;
        }

        .avatar-pick-container {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        .avatar-preview-pod {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: #EEF2FF;
          border: 3px solid #E0E7FF;
          position: relative;
          cursor: pointer;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
        }

        .avatar-preview-pod:hover {
          transform: scale(1.05);
        }

        .avatar-preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .add-photo-text {
          font-size: 10px;
          font-weight: 700;
          color: #6C5CE7;
        }

        .camera-badge {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #6C5CE7;
          border: 2px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .input-group {
          margin-bottom: 16px;
          text-align: left;
        }

        .input-field-label {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: #4A5568;
          margin-bottom: 6px;
        }

        .input-field-wrapper {
          display: flex;
          align-items: center;
          background: #F4F7FC;
          border: 1.5px solid #E2E8F0;
          border-radius: 16px;
          padding: 0 12px;
          height: 48px;
          transition: border-color 0.2s ease;
        }

        .input-field-wrapper:focus-within {
          border-color: #6C5CE7;
          background: white;
        }

        .field-icon {
          margin-right: 8px;
          flex-shrink: 0;
        }

        .text-input-field {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 15px;
          font-weight: 600;
          color: #2D3436;
          outline: none;
          font-family: inherit;
        }

        .input-row-flex {
          display: flex;
          gap: 12px;
        }

        .btn-save-profile {
          width: 100%;
          padding: 14px;
          border-radius: 18px;
          background: linear-gradient(135deg, #6C5CE7 0%, #00CEC9 100%);
          color: white;
          font-size: 16px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 6px 18px rgba(108, 92, 231, 0.25);
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
};
