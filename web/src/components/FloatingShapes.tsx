import React from "react";

export const FloatingShapes: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 2,
        overflow: "hidden",
      }}
    >
      {/* Cloud 1 */}
      <svg
        style={{
          position: "absolute",
          top: "80px",
          left: "-25px",
          opacity: 0.22,
          animation: "floatSlow 9s ease-in-out infinite",
        }}
        width="110"
        height="65"
        viewBox="0 0 24 24"
        fill="#6C5CE7"
      >
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
      </svg>

      {/* Cloud 2 */}
      <svg
        style={{
          position: "absolute",
          top: "380px",
          right: "-20px",
          opacity: 0.18,
          animation: "floatSlow 11s ease-in-out infinite reverse",
        }}
        width="100"
        height="60"
        viewBox="0 0 24 24"
        fill="#00CEC9"
      >
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
      </svg>

      {/* Star 1 */}
      <svg
        style={{
          position: "absolute",
          top: "40px",
          right: "18%",
          opacity: 0.25,
          animation: "floatSlow 5s ease-in-out infinite",
        }}
        width="34"
        height="34"
        viewBox="0 0 24 24"
        fill="#FFD93D"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>

      {/* Star 2 */}
      <svg
        style={{
          position: "absolute",
          top: "260px",
          left: "8%",
          opacity: 0.22,
          animation: "floatSlow 6s ease-in-out infinite reverse",
        }}
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="#FF7675"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>

      {/* Star 3 */}
      <svg
        style={{
          position: "absolute",
          top: "540px",
          right: "12%",
          opacity: 0.22,
          animation: "floatSlow 7s ease-in-out infinite",
        }}
        width="42"
        height="42"
        viewBox="0 0 24 24"
        fill="#A29BFE"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>

      {/* Moon */}
      <svg
        style={{
          position: "absolute",
          top: "120px",
          left: "14%",
          opacity: 0.2,
          animation: "floatSlow 8s ease-in-out infinite",
        }}
        width="44"
        height="44"
        viewBox="0 0 24 24"
        fill="#FDCB6E"
      >
        <path d="M12.3 2a10 10 0 0 0-.19 14 10 10 0 0 0 11.51 3.4 1 1 0 0 0 .5-1.3A10 10 0 0 1 12.3 2z" />
      </svg>

      {/* Soft Colorful Orbs */}
      <div
        style={{
          position: "absolute",
          top: "440px",
          left: "25%",
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: "radial-gradient(circle, #4ECDC4 0%, transparent 70%)",
          opacity: 0.12,
          filter: "blur(10px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "30px",
          right: "30%",
          width: "90px",
          height: "90px",
          borderRadius: "50%",
          background: "radial-gradient(circle, #FF8E8E 0%, transparent 70%)",
          opacity: 0.15,
          filter: "blur(8px)",
        }}
      />
    </div>
  );
};
