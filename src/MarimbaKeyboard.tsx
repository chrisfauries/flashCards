import React, { useEffect, useRef, useState } from "react";
import { PITCH } from "./data/pitch";
import {
  MARIMBA_BAR,
  MARIMBA_BARS,
  MARIMBA_HEIGHT,
  MARIMBA_WIDTH,
  getBarAt,
} from "./data/marimba";

export enum MARKER_STYLE {
  HIGHLIGHT,
  CORRECT,
  INCORRECT,
}

export interface MARIMBA_MARKER {
  pitch: PITCH;
  style: MARKER_STYLE;
}

interface Props {
  markers?: MARIMBA_MARKER[];
  onBarTap?: (pitch: PITCH) => void;
  disabled?: boolean;
}

// Canvas is drawn at 2x for crisp lines, then scaled down with CSS
const RESOLUTION = 2;

const BAR_FILL = "#ffffff";
const BAR_HOVER_FILL = "#e0e7ff";
const BAR_STROKE = "#1e293b";
const CORRECT_FILL = "#34d399";
const INCORRECT_FILL = "#fb7185";
const HIGHLIGHT_FILL = "#818cf8";

const traceBar = (ctx: CanvasRenderingContext2D, bar: MARIMBA_BAR) => {
  const r = 6;
  const { x, y, width: w, height: h } = bar;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

const MarimbaKeyboard: React.FC<Props> = ({
  markers = [],
  onBarTap,
  disabled = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredPitch, setHoveredPitch] = useState<PITCH | null>(null);
  const isInteractive = !!onBarTap && !disabled;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.setTransform(RESOLUTION, 0, 0, RESOLUTION, 0, 0);
    ctx.clearRect(0, 0, MARIMBA_WIDTH, MARIMBA_HEIGHT);

    const getMarker = (bar: MARIMBA_BAR) =>
      markers.find((m) => m.pitch === bar.pitch);

    const getFill = (bar: MARIMBA_BAR) => {
      const marker = getMarker(bar);
      if (marker?.style === MARKER_STYLE.HIGHLIGHT) return HIGHLIGHT_FILL;
      if (marker?.style === MARKER_STYLE.CORRECT) return CORRECT_FILL;
      if (marker?.style === MARKER_STYLE.INCORRECT) return INCORRECT_FILL;
      if (isInteractive && hoveredPitch === bar.pitch) return BAR_HOVER_FILL;
      return BAR_FILL;
    };

    // Naturals first so the accidental row overlaps them, matching an overhead view
    [...MARIMBA_BARS.naturals, ...MARIMBA_BARS.accidentals].forEach((bar) => {
      traceBar(ctx, bar);
      ctx.fillStyle = getFill(bar);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = BAR_STROKE;
      ctx.stroke();
    });
  }, [markers, hoveredPitch, isInteractive]);

  const getBarFromEvent = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * MARIMBA_WIDTH;
    const y = ((e.clientY - rect.top) / rect.height) * MARIMBA_HEIGHT;
    return getBarAt(x, y);
  };

  return (
    <div className="bg-white w-full flex items-center justify-center overflow-hidden p-2 sm:p-4">
      <canvas
        ref={canvasRef}
        width={MARIMBA_WIDTH * RESOLUTION}
        height={MARIMBA_HEIGHT * RESOLUTION}
        className={`w-full h-auto max-w-full select-none touch-none ${
          isInteractive && hoveredPitch !== null ? "cursor-pointer" : ""
        }`}
        onPointerDown={(e) => {
          if (!isInteractive) return;
          const bar = getBarFromEvent(e);
          if (bar) onBarTap?.(bar.pitch);
        }}
        onPointerMove={(e) => {
          if (!isInteractive || e.pointerType !== "mouse") return;
          setHoveredPitch(getBarFromEvent(e)?.pitch ?? null);
        }}
        onPointerLeave={() => setHoveredPitch(null)}
      />
    </div>
  );
};

export default MarimbaKeyboard;
