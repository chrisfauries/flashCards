import { BASS_CLEF_IMAGES, TREBLE_CLEF_IMAGES } from "./cardImageMap";
import {
  ACCIDENTAL,
  CLEF,
  NOTE_NAME,
  PITCH,
  PITCH_TO_NOTE_NAMES_MAP,
  PITCH_TO_OCTAVE_MAP,
} from "./pitch";

export interface CARD {
  clef: CLEF;
  pitch: PITCH;
  accidental: ACCIDENTAL;
  octave: number;
  img: string;
  noteName: NOTE_NAME;
}

export type CARD_ACCIDENTAL_MAP = { [key in ACCIDENTAL]?: CARD };

const throwMissing = (message: string) => {
  throw new Error(message);
};

// TODO: throw missing
const getCard = (clef: CLEF, pitch: PITCH, accidental: ACCIDENTAL): CARD => ({
  clef,
  pitch,
  accidental,
  octave: PITCH_TO_OCTAVE_MAP[pitch],
  img: (clef === CLEF.TREBLE
    ? TREBLE_CLEF_IMAGES[pitch]?.[accidental]!!
    : BASS_CLEF_IMAGES[pitch]?.[accidental])!!,
  // ?? throwMissing("missing images for note card"),
  noteName: PITCH_TO_NOTE_NAMES_MAP[pitch]?.[accidental]!!,
  //??    throwMissing("missing note name for note card"),
});

export const TREBLE_CARDS: { [key in PITCH]?: CARD_ACCIDENTAL_MAP } = {
  [PITCH.E_NATURAL_3]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.TREBLE,
      PITCH.E_NATURAL_3,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.F_NATURAL_3]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.TREBLE,
      PITCH.F_NATURAL_3,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.F_SHARP_G_FLAT_3]: {
    [ACCIDENTAL.SHARP]: getCard(
      CLEF.TREBLE,
      PITCH.F_SHARP_G_FLAT_3,
      ACCIDENTAL.SHARP
    ),
    [ACCIDENTAL.FLAT]: getCard(
      CLEF.TREBLE,
      PITCH.F_SHARP_G_FLAT_3,
      ACCIDENTAL.FLAT
    ),
  },
  [PITCH.G_NATURAL_3]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.TREBLE,
      PITCH.G_NATURAL_3,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.G_SHARP_A_FLAT_3]: {
    [ACCIDENTAL.SHARP]: getCard(
      CLEF.TREBLE,
      PITCH.G_SHARP_A_FLAT_3,
      ACCIDENTAL.SHARP
    ),
    [ACCIDENTAL.FLAT]: getCard(
      CLEF.TREBLE,
      PITCH.G_SHARP_A_FLAT_3,
      ACCIDENTAL.FLAT
    ),
  },
  [PITCH.A_NATURAL_3]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.TREBLE,
      PITCH.A_NATURAL_3,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.A_SHARP_B_FLAT_3]: {
    [ACCIDENTAL.SHARP]: getCard(
      CLEF.TREBLE,
      PITCH.A_SHARP_B_FLAT_3,
      ACCIDENTAL.SHARP
    ),
    [ACCIDENTAL.FLAT]: getCard(
      CLEF.TREBLE,
      PITCH.A_SHARP_B_FLAT_3,
      ACCIDENTAL.FLAT
    ),
  },
  [PITCH.B_NATURAL_3]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.TREBLE,
      PITCH.B_NATURAL_3,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.C_NATURAL_4]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.TREBLE,
      PITCH.C_NATURAL_4,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.C_SHARP_D_FLAT_4]: {
    [ACCIDENTAL.SHARP]: getCard(
      CLEF.TREBLE,
      PITCH.C_SHARP_D_FLAT_4,
      ACCIDENTAL.SHARP
    ),
    [ACCIDENTAL.FLAT]: getCard(
      CLEF.TREBLE,
      PITCH.C_SHARP_D_FLAT_4,
      ACCIDENTAL.FLAT
    ),
  },
  [PITCH.D_NATURAL_4]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.TREBLE,
      PITCH.D_NATURAL_4,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.D_SHARP_E_FLAT_4]: {
    [ACCIDENTAL.SHARP]: getCard(
      CLEF.TREBLE,
      PITCH.D_SHARP_E_FLAT_4,
      ACCIDENTAL.SHARP
    ),
    [ACCIDENTAL.FLAT]: getCard(
      CLEF.TREBLE,
      PITCH.D_SHARP_E_FLAT_4,
      ACCIDENTAL.FLAT
    ),
  },
  [PITCH.E_NATURAL_4]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.TREBLE,
      PITCH.E_NATURAL_4,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.F_NATURAL_4]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.TREBLE,
      PITCH.F_NATURAL_4,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.F_SHARP_G_FLAT_4]: {
    [ACCIDENTAL.SHARP]: getCard(
      CLEF.TREBLE,
      PITCH.F_SHARP_G_FLAT_4,
      ACCIDENTAL.SHARP
    ),
    [ACCIDENTAL.FLAT]: getCard(
      CLEF.TREBLE,
      PITCH.F_SHARP_G_FLAT_4,
      ACCIDENTAL.FLAT
    ),
  },
  [PITCH.G_NATURAL_4]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.TREBLE,
      PITCH.G_NATURAL_4,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.G_SHARP_A_FLAT_4]: {
    [ACCIDENTAL.SHARP]: getCard(
      CLEF.TREBLE,
      PITCH.G_SHARP_A_FLAT_4,
      ACCIDENTAL.SHARP
    ),
    [ACCIDENTAL.FLAT]: getCard(
      CLEF.TREBLE,
      PITCH.G_SHARP_A_FLAT_4,
      ACCIDENTAL.FLAT
    ),
  },
  [PITCH.A_NATURAL_4]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.TREBLE,
      PITCH.A_NATURAL_4,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.A_SHARP_B_FLAT_4]: {
    [ACCIDENTAL.SHARP]: getCard(
      CLEF.TREBLE,
      PITCH.A_SHARP_B_FLAT_4,
      ACCIDENTAL.SHARP
    ),
    [ACCIDENTAL.FLAT]: getCard(
      CLEF.TREBLE,
      PITCH.A_SHARP_B_FLAT_4,
      ACCIDENTAL.FLAT
    ),
  },
  [PITCH.B_NATURAL_4]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.TREBLE,
      PITCH.B_NATURAL_4,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.C_NATURAL_5]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.TREBLE,
      PITCH.C_NATURAL_5,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.C_SHARP_D_FLAT_5]: {
    [ACCIDENTAL.SHARP]: getCard(
      CLEF.TREBLE,
      PITCH.C_SHARP_D_FLAT_5,
      ACCIDENTAL.SHARP
    ),
    [ACCIDENTAL.FLAT]: getCard(
      CLEF.TREBLE,
      PITCH.C_SHARP_D_FLAT_5,
      ACCIDENTAL.FLAT
    ),
  },
  [PITCH.D_NATURAL_5]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.TREBLE,
      PITCH.D_NATURAL_5,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.D_SHARP_E_FLAT_5]: {
    [ACCIDENTAL.SHARP]: getCard(
      CLEF.TREBLE,
      PITCH.D_SHARP_E_FLAT_5,
      ACCIDENTAL.SHARP
    ),
    [ACCIDENTAL.FLAT]: getCard(
      CLEF.TREBLE,
      PITCH.D_SHARP_E_FLAT_5,
      ACCIDENTAL.FLAT
    ),
  },
  [PITCH.E_NATURAL_5]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.TREBLE,
      PITCH.E_NATURAL_5,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.F_NATURAL_5]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.TREBLE,
      PITCH.F_NATURAL_5,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.F_SHARP_G_FLAT_5]: {
    [ACCIDENTAL.SHARP]: getCard(
      CLEF.TREBLE,
      PITCH.F_SHARP_G_FLAT_5,
      ACCIDENTAL.SHARP
    ),
    [ACCIDENTAL.FLAT]: getCard(
      CLEF.TREBLE,
      PITCH.F_SHARP_G_FLAT_5,
      ACCIDENTAL.FLAT
    ),
  },
  [PITCH.G_NATURAL_5]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.TREBLE,
      PITCH.G_NATURAL_5,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.G_SHARP_A_FLAT_5]: {
    [ACCIDENTAL.SHARP]: getCard(
      CLEF.TREBLE,
      PITCH.G_SHARP_A_FLAT_5,
      ACCIDENTAL.SHARP
    ),
    [ACCIDENTAL.FLAT]: getCard(
      CLEF.TREBLE,
      PITCH.G_SHARP_A_FLAT_5,
      ACCIDENTAL.FLAT
    ),
  },
  [PITCH.A_NATURAL_5]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.TREBLE,
      PITCH.A_NATURAL_5,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.A_SHARP_B_FLAT_5]: {
    [ACCIDENTAL.SHARP]: getCard(
      CLEF.TREBLE,
      PITCH.A_SHARP_B_FLAT_5,
      ACCIDENTAL.SHARP
    ),
    [ACCIDENTAL.FLAT]: getCard(
      CLEF.TREBLE,
      PITCH.A_SHARP_B_FLAT_5,
      ACCIDENTAL.FLAT
    ),
  },
  [PITCH.B_NATURAL_5]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.TREBLE,
      PITCH.B_NATURAL_5,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.C_NATURAL_6]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.TREBLE,
      PITCH.C_NATURAL_6,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.C_SHARP_D_FLAT_6]: {
    [ACCIDENTAL.SHARP]: getCard(
      CLEF.TREBLE,
      PITCH.C_SHARP_D_FLAT_6,
      ACCIDENTAL.SHARP
    ),
    [ACCIDENTAL.FLAT]: getCard(
      CLEF.TREBLE,
      PITCH.C_SHARP_D_FLAT_6,
      ACCIDENTAL.FLAT
    ),
  },
  [PITCH.D_NATURAL_6]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.TREBLE,
      PITCH.D_NATURAL_6,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.D_SHARP_E_FLAT_6]: {
    [ACCIDENTAL.SHARP]: getCard(
      CLEF.TREBLE,
      PITCH.D_SHARP_E_FLAT_6,
      ACCIDENTAL.SHARP
    ),
    [ACCIDENTAL.FLAT]: getCard(
      CLEF.TREBLE,
      PITCH.D_SHARP_E_FLAT_6,
      ACCIDENTAL.FLAT
    ),
  },
  [PITCH.E_NATURAL_6]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.TREBLE,
      PITCH.E_NATURAL_6,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.F_NATURAL_6]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.TREBLE,
      PITCH.F_NATURAL_6,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.F_SHARP_G_FLAT_6]: {
    [ACCIDENTAL.SHARP]: getCard(
      CLEF.TREBLE,
      PITCH.F_SHARP_G_FLAT_6,
      ACCIDENTAL.SHARP
    ),
    [ACCIDENTAL.FLAT]: getCard(
      CLEF.TREBLE,
      PITCH.F_SHARP_G_FLAT_6,
      ACCIDENTAL.FLAT
    ),
  },
  [PITCH.G_NATURAL_6]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.TREBLE,
      PITCH.G_NATURAL_6,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.G_SHARP_A_FLAT_6]: {
    [ACCIDENTAL.SHARP]: getCard(
      CLEF.TREBLE,
      PITCH.G_SHARP_A_FLAT_6,
      ACCIDENTAL.SHARP
    ),
    [ACCIDENTAL.FLAT]: getCard(
      CLEF.TREBLE,
      PITCH.G_SHARP_A_FLAT_6,
      ACCIDENTAL.FLAT
    ),
  },
  [PITCH.A_NATURAL_6]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.TREBLE,
      PITCH.A_NATURAL_6,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.A_SHARP_B_FLAT_6]: {
    [ACCIDENTAL.SHARP]: getCard(
      CLEF.TREBLE,
      PITCH.A_SHARP_B_FLAT_6,
      ACCIDENTAL.SHARP
    ),
    [ACCIDENTAL.FLAT]: getCard(
      CLEF.TREBLE,
      PITCH.A_SHARP_B_FLAT_6,
      ACCIDENTAL.FLAT
    ),
  },
  [PITCH.B_NATURAL_6]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.TREBLE,
      PITCH.B_NATURAL_6,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.C_NATURAL_7]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.TREBLE,
      PITCH.C_NATURAL_7,
      ACCIDENTAL.NATURAL
    ),
  },
};

export const BASS_CARDS: { [key in PITCH]?: CARD_ACCIDENTAL_MAP } = {
  [PITCH.F_NATURAL_1]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.BASS,
      PITCH.F_NATURAL_1,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.F_SHARP_G_FLAT_1]: {
    [ACCIDENTAL.SHARP]: getCard(
      CLEF.BASS,
      PITCH.F_SHARP_G_FLAT_1,
      ACCIDENTAL.SHARP
    ),
    [ACCIDENTAL.FLAT]: getCard(
      CLEF.BASS,
      PITCH.F_SHARP_G_FLAT_1,
      ACCIDENTAL.FLAT
    ),
  },
  [PITCH.G_NATURAL_1]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.BASS,
      PITCH.G_NATURAL_1,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.G_SHARP_A_FLAT_1]: {
    [ACCIDENTAL.SHARP]: getCard(
      CLEF.BASS,
      PITCH.G_SHARP_A_FLAT_1,
      ACCIDENTAL.SHARP
    ),
    [ACCIDENTAL.FLAT]: getCard(
      CLEF.BASS,
      PITCH.G_SHARP_A_FLAT_1,
      ACCIDENTAL.FLAT
    ),
  },
  [PITCH.A_NATURAL_1]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.BASS,
      PITCH.A_NATURAL_1,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.A_SHARP_B_FLAT_1]: {
    [ACCIDENTAL.SHARP]: getCard(
      CLEF.BASS,
      PITCH.A_SHARP_B_FLAT_1,
      ACCIDENTAL.SHARP
    ),
    [ACCIDENTAL.FLAT]: getCard(
      CLEF.BASS,
      PITCH.A_SHARP_B_FLAT_1,
      ACCIDENTAL.FLAT
    ),
  },
  [PITCH.B_NATURAL_1]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.BASS,
      PITCH.B_NATURAL_1,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.C_NATURAL_2]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.BASS,
      PITCH.C_NATURAL_2,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.C_SHARP_D_FLAT_2]: {
    [ACCIDENTAL.SHARP]: getCard(
      CLEF.BASS,
      PITCH.C_SHARP_D_FLAT_2,
      ACCIDENTAL.SHARP
    ),
    [ACCIDENTAL.FLAT]: getCard(
      CLEF.BASS,
      PITCH.C_SHARP_D_FLAT_2,
      ACCIDENTAL.FLAT
    ),
  },
  [PITCH.D_NATURAL_2]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.BASS,
      PITCH.D_NATURAL_2,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.D_SHARP_E_FLAT_2]: {
    [ACCIDENTAL.SHARP]: getCard(
      CLEF.BASS,
      PITCH.D_SHARP_E_FLAT_2,
      ACCIDENTAL.SHARP
    ),
    [ACCIDENTAL.FLAT]: getCard(
      CLEF.BASS,
      PITCH.D_SHARP_E_FLAT_2,
      ACCIDENTAL.FLAT
    ),
  },
  [PITCH.E_NATURAL_2]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.BASS,
      PITCH.E_NATURAL_2,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.F_NATURAL_2]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.BASS,
      PITCH.F_NATURAL_2,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.F_SHARP_G_FLAT_2]: {
    [ACCIDENTAL.SHARP]: getCard(
      CLEF.BASS,
      PITCH.F_SHARP_G_FLAT_2,
      ACCIDENTAL.SHARP
    ),
    [ACCIDENTAL.FLAT]: getCard(
      CLEF.BASS,
      PITCH.F_SHARP_G_FLAT_2,
      ACCIDENTAL.FLAT
    ),
  },
  [PITCH.G_NATURAL_2]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.BASS,
      PITCH.G_NATURAL_2,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.G_SHARP_A_FLAT_2]: {
    [ACCIDENTAL.SHARP]: getCard(
      CLEF.BASS,
      PITCH.G_SHARP_A_FLAT_2,
      ACCIDENTAL.SHARP
    ),
    [ACCIDENTAL.FLAT]: getCard(
      CLEF.BASS,
      PITCH.G_SHARP_A_FLAT_2,
      ACCIDENTAL.FLAT
    ),
  },
  [PITCH.A_NATURAL_2]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.BASS,
      PITCH.A_NATURAL_2,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.A_SHARP_B_FLAT_2]: {
    [ACCIDENTAL.SHARP]: getCard(
      CLEF.BASS,
      PITCH.A_SHARP_B_FLAT_2,
      ACCIDENTAL.SHARP
    ),
    [ACCIDENTAL.FLAT]: getCard(
      CLEF.BASS,
      PITCH.A_SHARP_B_FLAT_2,
      ACCIDENTAL.FLAT
    ),
  },
  [PITCH.B_NATURAL_2]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.BASS,
      PITCH.B_NATURAL_2,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.C_NATURAL_3]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.BASS,
      PITCH.C_NATURAL_3,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.C_SHARP_D_FLAT_3]: {
    [ACCIDENTAL.SHARP]: getCard(
      CLEF.BASS,
      PITCH.C_SHARP_D_FLAT_3,
      ACCIDENTAL.SHARP
    ),
    [ACCIDENTAL.FLAT]: getCard(
      CLEF.BASS,
      PITCH.C_SHARP_D_FLAT_3,
      ACCIDENTAL.FLAT
    ),
  },
  [PITCH.D_NATURAL_3]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.BASS,
      PITCH.D_NATURAL_3,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.D_SHARP_E_FLAT_3]: {
    [ACCIDENTAL.SHARP]: getCard(
      CLEF.BASS,
      PITCH.D_SHARP_E_FLAT_3,
      ACCIDENTAL.SHARP
    ),
    [ACCIDENTAL.FLAT]: getCard(
      CLEF.BASS,
      PITCH.D_SHARP_E_FLAT_3,
      ACCIDENTAL.FLAT
    ),
  },
  [PITCH.E_NATURAL_3]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.BASS,
      PITCH.E_NATURAL_3,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.F_NATURAL_3]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.BASS,
      PITCH.F_NATURAL_3,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.F_SHARP_G_FLAT_3]: {
    [ACCIDENTAL.SHARP]: getCard(
      CLEF.BASS,
      PITCH.F_SHARP_G_FLAT_3,
      ACCIDENTAL.SHARP
    ),
    [ACCIDENTAL.FLAT]: getCard(
      CLEF.BASS,
      PITCH.F_SHARP_G_FLAT_3,
      ACCIDENTAL.FLAT
    ),
  },
  [PITCH.G_NATURAL_3]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.BASS,
      PITCH.G_NATURAL_3,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.G_SHARP_A_FLAT_3]: {
    [ACCIDENTAL.SHARP]: getCard(
      CLEF.BASS,
      PITCH.G_SHARP_A_FLAT_3,
      ACCIDENTAL.SHARP
    ),
    [ACCIDENTAL.FLAT]: getCard(
      CLEF.BASS,
      PITCH.G_SHARP_A_FLAT_3,
      ACCIDENTAL.FLAT
    ),
  },
  [PITCH.A_NATURAL_3]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.BASS,
      PITCH.A_NATURAL_3,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.A_SHARP_B_FLAT_3]: {
    [ACCIDENTAL.SHARP]: getCard(
      CLEF.BASS,
      PITCH.A_SHARP_B_FLAT_3,
      ACCIDENTAL.SHARP
    ),
    [ACCIDENTAL.FLAT]: getCard(
      CLEF.BASS,
      PITCH.A_SHARP_B_FLAT_3,
      ACCIDENTAL.FLAT
    ),
  },
  [PITCH.B_NATURAL_3]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.BASS,
      PITCH.B_NATURAL_3,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.C_NATURAL_4]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.BASS,
      PITCH.C_NATURAL_4,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.C_SHARP_D_FLAT_4]: {
    [ACCIDENTAL.SHARP]: getCard(
      CLEF.BASS,
      PITCH.C_SHARP_D_FLAT_4,
      ACCIDENTAL.SHARP
    ),
    [ACCIDENTAL.FLAT]: getCard(
      CLEF.BASS,
      PITCH.C_SHARP_D_FLAT_4,
      ACCIDENTAL.FLAT
    ),
  },
  [PITCH.D_NATURAL_4]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.BASS,
      PITCH.D_NATURAL_4,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.D_SHARP_E_FLAT_4]: {
    [ACCIDENTAL.SHARP]: getCard(
      CLEF.BASS,
      PITCH.D_SHARP_E_FLAT_4,
      ACCIDENTAL.SHARP
    ),
    [ACCIDENTAL.FLAT]: getCard(
      CLEF.BASS,
      PITCH.D_SHARP_E_FLAT_4,
      ACCIDENTAL.FLAT
    ),
  },
  [PITCH.E_NATURAL_4]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.BASS,
      PITCH.E_NATURAL_4,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.F_NATURAL_4]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.BASS,
      PITCH.F_NATURAL_4,
      ACCIDENTAL.NATURAL
    ),
  },
  [PITCH.F_SHARP_G_FLAT_4]: {
    [ACCIDENTAL.SHARP]: getCard(
      CLEF.BASS,
      PITCH.F_SHARP_G_FLAT_4,
      ACCIDENTAL.SHARP
    ),
    [ACCIDENTAL.FLAT]: getCard(
      CLEF.BASS,
      PITCH.F_SHARP_G_FLAT_4,
      ACCIDENTAL.FLAT
    ),
  },
  [PITCH.G_NATURAL_4]: {
    [ACCIDENTAL.NATURAL]: getCard(
      CLEF.BASS,
      PITCH.G_NATURAL_4,
      ACCIDENTAL.NATURAL
    ),
  },
};
