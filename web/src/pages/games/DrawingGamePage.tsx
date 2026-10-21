import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Paintbrush,
  Eraser,
  RotateCcw,
  Trash2,
  Download,
} from "lucide-react";
import { playSound } from "../../utils/audio";

const PALETTE_COLORS = [
  "#6C5CE7",
  "#00CEC9",
  "#FDCB6E",
  "#FF7675",
  "#55EFC4",
  "#FF80AB",
  "#3F51B5",
  "#000000",
];

const BRUSH_SIZES = [4, 8, 14, 22];

export const DrawingGamePage: React.FC = () => {
  const navigate = useNavigate();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedColor, setSelectedColor] = useState(PALETTE_COLORS[0]);
  const [brushSize, setBrushSize] = useState(8);
  const [isEraser, setIsEraser] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  // Undo history
  const [history, setHistory] = useState<ImageData[]>([]);

  // Setup canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // Set resolution matching display size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Initial white background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Save initial blank state
    setHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
  }, []);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    setHistory((prev) => [
      ...prev.slice(-12),
      ctx.getImageData(0, 0, canvas.width, canvas.height),
    ]);
  };

  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if ("touches" in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ("clientX" in e) {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = isEraser ? brushSize * 2 : brushSize;
    ctx.strokeStyle = isEraser ? "#FFFFFF" : selectedColor;

    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveState();
    }
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    playSound("click");

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const newHistory = history.slice(0, -1);
    const prevState = newHistory[newHistory.length - 1];
    ctx.putImageData(prevState, 0, 0);
    setHistory(newHistory);
  };

  const handleClear = () => {
    playSound("pop");
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, rect.width, rect.height);
    saveState();
  };

  const handleSaveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    playSound("correct");

    const link = document.createElement("a");
    link.download = `my-drawing-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="drawing-screen">
      {/* Top Header */}
      <header className="drawing-top-header">
        <button
          onClick={() => navigate(-1)}
          className="back-btn-round btn-pressable"
          aria-label="Back"
        >
          <ArrowLeft size={22} color="#673AB7" strokeWidth={2.5} />
        </button>

        <h1 className="header-title-text" style={{ color: "white" }}>
          Magic Drawing
        </h1>

        <div className="drawing-header-actions">
          <button
            onClick={handleUndo}
            disabled={history.length <= 1}
            className="action-circle-btn btn-pressable"
            title="Undo"
          >
            <RotateCcw size={18} color="white" />
          </button>
          <button
            onClick={handleClear}
            className="action-circle-btn btn-pressable"
            title="Clear"
          >
            <Trash2 size={18} color="white" />
          </button>
          <button
            onClick={handleSaveImage}
            className="action-circle-btn btn-pressable"
            title="Download Drawing"
          >
            <Download size={18} color="white" />
          </button>
        </div>
      </header>

      {/* Canvas Working Area */}
      <div className="canvas-wrapper-box">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="drawing-canvas-element"
        />
      </div>

      {/* Tools Toolbar: Colors, Tools, Sizes */}
      <div className="drawing-tools-bar">
        {/* Tool Mode (Brush vs Eraser) */}
        <div className="tool-mode-pill">
          <button
            onClick={() => {
              setIsEraser(false);
              playSound("click");
            }}
            className={`tool-switch-btn ${!isEraser ? "active" : ""}`}
            title="Brush"
          >
            <Paintbrush size={18} />
          </button>
          <button
            onClick={() => {
              setIsEraser(true);
              playSound("click");
            }}
            className={`tool-switch-btn ${isEraser ? "active" : ""}`}
            title="Eraser"
          >
            <Eraser size={18} />
          </button>
        </div>

        {/* Brush Sizes */}
        <div className="brush-sizes-group">
          {BRUSH_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => {
                setBrushSize(size);
                playSound("click");
              }}
              className={`size-dot-btn ${brushSize === size ? "active" : ""}`}
              aria-label={`Size ${size}`}
            >
              <div
                className="size-dot-inner"
                style={{ width: size, height: size }}
              />
            </button>
          ))}
        </div>

        {/* Color Palette */}
        <div className="colors-palette-strip">
          {PALETTE_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => {
                setSelectedColor(c);
                setIsEraser(false);
                playSound("click");
              }}
              className={`palette-color-btn ${
                selectedColor === c && !isEraser ? "selected" : ""
              }`}
              style={{ backgroundColor: c }}
              aria-label={`Color ${c}`}
            />
          ))}
        </div>
      </div>

      <style>{`
        .drawing-screen {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          background: #F0F4F8;
          position: relative;
        }

        .drawing-top-header {
          background: linear-gradient(135deg, #673AB7 0%, #9C27B0 100%);
          padding: 16px 18px 20px 18px;
          border-bottom-left-radius: 28px;
          border-bottom-right-radius: 28px;
          box-shadow: 0 8px 24px rgba(103, 58, 183, 0.25);
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 20;
        }

        .drawing-header-actions {
          display: flex;
          gap: 8px;
        }

        .action-circle-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.22);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-circle-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .canvas-wrapper-box {
          flex: 1;
          margin: 12px 14px;
          border-radius: 28px;
          overflow: hidden;
          background: white;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          border: 3px solid #E2E8F0;
          touch-action: none;
        }

        .drawing-canvas-element {
          width: 100%;
          height: 100%;
          display: block;
          cursor: crosshair;
        }

        .drawing-tools-bar {
          background: white;
          border-top-left-radius: 28px;
          border-top-right-radius: 28px;
          padding: 12px 16px 20px 16px;
          box-shadow: 0 -6px 20px rgba(0, 0, 0, 0.06);
          display: flex;
          flex-direction: column;
          gap: 12px;
          z-index: 30;
        }

        .tool-mode-pill {
          display: inline-flex;
          align-self: center;
          background: #F1F3F9;
          padding: 4px;
          border-radius: 20px;
          gap: 4px;
        }

        .tool-switch-btn {
          padding: 6px 16px;
          border-radius: 16px;
          background: transparent;
          color: #718096;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .tool-switch-btn.active {
          background: #673AB7;
          color: white;
          box-shadow: 0 2px 8px rgba(103, 58, 183, 0.3);
        }

        .brush-sizes-group {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }

        .size-dot-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #F1F3F9;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: 2px solid transparent;
        }

        .size-dot-btn.active {
          border-color: #673AB7;
          background: white;
        }

        .size-dot-inner {
          background: #2D3436;
          border-radius: 50%;
        }

        .colors-palette-strip {
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 4px 0;
        }

        .palette-color-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
          transition: transform 0.15s ease;
        }

        .palette-color-btn:hover {
          transform: scale(1.15);
        }

        .palette-color-btn.selected {
          transform: scale(1.25);
          border-color: #2D3436;
        }
      `}</style>
    </div>
  );
};
