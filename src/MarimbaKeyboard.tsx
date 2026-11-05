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
  // Stretch to the parent's width and height instead of keeping the default proportions
  fillContainer?: boolean;
}

const NATURAL_ASPECT = MARIMBA_WIDTH / MARIMBA_HEIGHT;

// When filling, bars can widen or shorten within these width:height limits
const MIN_FILL_ASPECT = 1.6;
const MAX_FILL_ASPECT = 4;

// p-3 + 1px border on the fill frame, kept out of the space the canvas can use
const FILL_FRAME_INSET = 13;

const BAR_FILL = "#ffffff";
const BAR_HOVER_FILL = "#e0e7ff";
const BAR_STROKE = "#1e293b";
const CORRECT_FILL = "#34d399";
const INCORRECT_FILL = "#fb7185";
const HIGHLIGHT_FILL = "#818cf8";

const traceBar = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) => {
  const r = Math.min(4, w / 4);
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
  fillContainer = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredPitch, setHoveredPitch] = useState<PITCH | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const isInteractive = !!onBarTap && !disabled;

  // Size the canvas (in CSS pixels) from the space its container gives it
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;

      if (!fillContainer) {
        setSize({ width, height: width / NATURAL_ASPECT });
        return;
      }

      const availableWidth = Math.max(0, width - FILL_FRAME_INSET * 2);
      const availableHeight = Math.max(0, height - FILL_FRAME_INSET * 2);
      if (!availableWidth || !availableHeight) return;

      const aspect = Math.min(
        MAX_FILL_ASPECT,
        Math.max(MIN_FILL_ASPECT, availableWidth / availableHeight)
      );
      const fitWidth = Math.min(availableWidth, availableHeight * aspect);
      setSize({ width: fitWidth, height: fitWidth / aspect });
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [fillContainer]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !size.width) return;

    const pixelRatio = window.devicePixelRatio || 1;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.clearRect(0, 0, size.width, size.height);

    // Layout units are scaled per axis so filling only changes bar proportions, not line weight
    const scaleX = size.width / MARIMBA_WIDTH;
    const scaleY = size.height / MARIMBA_HEIGHT;

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
      traceBar(
        ctx,
        bar.x * scaleX,
        bar.y * scaleY,
        bar.width * scaleX,
        bar.height * scaleY
      );
      ctx.fillStyle = getFill(bar);
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = BAR_STROKE;
      ctx.stroke();
    });
  }, [markers, hoveredPitch, isInteractive, size]);

  const getBarFromEvent = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * MARIMBA_WIDTH;
    const y = ((e.clientY - rect.top) / rect.height) * MARIMBA_HEIGHT;
    return getBarAt(x, y);
  };

  const pixelRatio = window.devicePixelRatio || 1;

  const canvas = (
    <canvas
      ref={canvasRef}
      width={Math.round(size.width * pixelRatio)}
      height={Math.round(size.height * pixelRatio)}
      style={{ width: size.width, height: size.height }}
      className={`block select-none touch-none ${
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
  );

  if (fillContainer) {
    return (
      <div ref={containerRef} className="w-full h-full min-h-0 flex items-center justify-center">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 p-3">
          {canvas}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="bg-white w-full flex items-center justify-center overflow-hidden p-2 sm:p-4">
      {canvas}
    </div>
  );
};

export default MarimbaKeyboard;
