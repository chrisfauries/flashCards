import {
  ACCIDENTAL,
  NOTE_NAME,
  NOTE_NAME_STRING_MAP,
  PITCH,
  PITCH_TO_NOTE_NAMES_MAP,
  PITCH_TO_OCTAVE_MAP,
} from "./pitch";

// Two octave marimba layout, C4 through C6
export const MARIMBA_LOWEST_PITCH = PITCH.C_NATURAL_4;
export const MARIMBA_HIGHEST_PITCH = PITCH.C_NATURAL_6;

// Semitone offsets (from C) of the natural bars within one octave
const NATURAL_SEMITONES = [0, 2, 4, 5, 7, 9, 11];

export interface MARIMBA_BAR {
  pitch: PITCH;
  isAccidental: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  // where the indicator dot is drawn (the part of the bar not overlapped by another row)
  centerX: number;
  centerY: number;
}

export const BAR_WIDTH = 80;
export const ACCIDENTAL_HEIGHT = 320;
export const NATURAL_TOP = 260;
export const NATURAL_HEIGHT = 330;
export const PADDING = 4;

const NATURAL_COUNT = 15;

export const MARIMBA_WIDTH = NATURAL_COUNT * BAR_WIDTH + PADDING * 2;
export const MARIMBA_HEIGHT = NATURAL_TOP + NATURAL_HEIGHT + PADDING * 2;

const getNaturalPitch = (naturalIndex: number): PITCH => {
  const octave = Math.floor(naturalIndex / 7);
  const semitone = NATURAL_SEMITONES[naturalIndex % 7];
  return (MARIMBA_LOWEST_PITCH + octave * 12 + semitone) as PITCH;
};

const buildBars = () => {
  const naturals: MARIMBA_BAR[] = [];
  const accidentals: MARIMBA_BAR[] = [];

  for (let i = 0; i < NATURAL_COUNT; i++) {
    const pitch = getNaturalPitch(i);
    const x = PADDING + i * BAR_WIDTH;
    naturals.push({
      pitch,
      isAccidental: false,
      x,
      y: PADDING + NATURAL_TOP,
      width: BAR_WIDTH,
      height: NATURAL_HEIGHT,
      centerX: x + BAR_WIDTH / 2,
      centerY: PADDING + (ACCIDENTAL_HEIGHT + NATURAL_TOP + NATURAL_HEIGHT) / 2,
    });

    // an accidental sits between this natural and the next one, unless they are a half step apart (E-F, B-C)
    if (i < NATURAL_COUNT - 1 && getNaturalPitch(i + 1) - pitch === 2) {
      const accidentalX = x + BAR_WIDTH / 2;
      accidentals.push({
        pitch: (pitch + 1) as PITCH,
        isAccidental: true,
        x: accidentalX,
        y: PADDING,
        width: BAR_WIDTH,
        height: ACCIDENTAL_HEIGHT,
        centerX: accidentalX + BAR_WIDTH / 2,
        centerY: PADDING + NATURAL_TOP / 2,
      });
    }
  }

  return { naturals, accidentals };
};

export const MARIMBA_BARS = buildBars();

// Accidentals are drawn on top, so they win any hit test
export const getBarAt = (x: number, y: number): MARIMBA_BAR | undefined =>
  [...MARIMBA_BARS.accidentals, ...MARIMBA_BARS.naturals].find(
    (bar) =>
      x >= bar.x &&
      x <= bar.x + bar.width &&
      y >= bar.y &&
      y <= bar.y + bar.height
  );

export const getBarForPitch = (pitch: PITCH): MARIMBA_BAR | undefined =>
  [...MARIMBA_BARS.accidentals, ...MARIMBA_BARS.naturals].find(
    (bar) => bar.pitch === pitch
  );

export const getNoteNamesForPitch = (pitch: PITCH): NOTE_NAME[] =>
  Object.values(PITCH_TO_NOTE_NAMES_MAP[pitch]) as NOTE_NAME[];

// e.g. "B4" or "C♯/D♭5" (OCTAVE is zero based, so FOURTH + 1 = 4)
export const getPitchLabel = (pitch: PITCH) =>
  [ACCIDENTAL.SHARP, ACCIDENTAL.NATURAL, ACCIDENTAL.FLAT]
    .map((accidental) => PITCH_TO_NOTE_NAMES_MAP[pitch][accidental])
    .filter((noteName): noteName is NOTE_NAME => noteName !== undefined)
    .map((noteName) => NOTE_NAME_STRING_MAP[noteName])
    .join("/") + (PITCH_TO_OCTAVE_MAP[pitch] + 1);
