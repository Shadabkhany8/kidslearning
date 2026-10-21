import React, { useState, useEffect } from "react";
import { ShieldCheck, X } from "lucide-react";
import { playSound } from "../utils/audio";

interface ParentalGateModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export const ParentalGateModal: React.FC<ParentalGateModalProps> = ({
  isOpen,
  onSuccess,
  onClose,
}) => {
  const [problem, setProblem] = useState({ n1: 0, n2: 0, ans: 0 });
  const [userAns, setUserAns] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const generateProblem = () => {
    const n1 = Math.floor(Math.random() * 8) + 2;
    const n2 = Math.floor(Math.random() * 8) + 2;
    setProblem({ n1, n2, ans: n1 + n2 });
    setUserAns("");
    setErrorMsg("");
  };

  useEffect(() => {
    if (isOpen) {
      generateProblem();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (parseInt(userAns.trim(), 10) === problem.ans) {
      playSound("correct");
      onSuccess();
    } else {
      playSound("wrong");
      setErrorMsg("Incorrect answer. Please try again or ask a parent!");
      generateProblem();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-card">
        <button
          onClick={onClose}
          className="modal-close-icon-btn"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="lock-icon-pod">
          <ShieldCheck size={36} color="#6C5CE7" strokeWidth={2.2} />
        </div>

        <h3 className="gate-heading">Parental Gate</h3>
        <p className="gate-desc">
          Please solve this simple math question to confirm you are an adult:
        </p>

        <form onSubmit={handleSubmit}>
          <div className="math-box">
            <span className="math-equation">
              {problem.n1} + {problem.n2} =
            </span>
            <input
              type="number"
              value={userAns}
              onChange={(e) => setUserAns(e.target.value)}
              placeholder="?"
              className="math-input"
              autoFocus
              maxLength={3}
            />
          </div>

          {errorMsg && <p className="gate-error-text">{errorMsg}</p>}

          <div className="gate-actions-row">
            <button
              type="button"
              onClick={onClose}
              className="btn-gate-cancel btn-pressable"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-gate-confirm btn-pressable"
              disabled={!userAns.trim()}
            >
              Confirm
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-close-icon-btn {
          position: absolute;
          top: 18px;
          right: 18px;
          background: #F1F3F9;
          border-radius: 50%;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #718096;
        }

        .lock-icon-pod {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: rgba(108, 92, 231, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 14px auto;
        }

        .gate-heading {
          font-size: 22px;
          font-weight: 800;
          color: #2D3436;
          margin-bottom: 6px;
        }

        .gate-desc {
          font-size: 14px;
          color: #636E72;
          margin-bottom: 20px;
          line-height: 1.4;
        }

        .math-box {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: #F4F7FC;
          padding: 16px 20px;
          border-radius: 20px;
          margin-bottom: 16px;
          border: 1.5px solid #E2E8F0;
        }

        .math-equation {
          font-size: 24px;
          font-weight: 800;
          color: #2D3436;
        }

        .math-input {
          width: 80px;
          padding: 8px 12px;
          border-radius: 14px;
          border: 2px solid #6C5CE7;
          font-size: 24px;
          font-weight: 800;
          text-align: center;
          font-family: inherit;
          color: #6C5CE7;
          background: white;
          outline: none;
        }

        .gate-error-text {
          color: #FF5252;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 14px;
        }

        .gate-actions-row {
          display: flex;
          gap: 12px;
        }

        .btn-gate-cancel {
          flex: 1;
          padding: 12px;
          border-radius: 16px;
          background: #F1F3F9;
          color: #4A5568;
          font-weight: 700;
          font-size: 15px;
        }

        .btn-gate-confirm {
          flex: 1;
          padding: 12px;
          border-radius: 16px;
          background: var(--primary);
          color: white;
          font-weight: 800;
          font-size: 15px;
          box-shadow: 0 4px 12px rgba(108, 92, 231, 0.3);
        }

        .btn-gate-confirm:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};
