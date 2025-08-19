import { CARD_ACCIDENTAL_MAP, TREBLE_CARDS } from "../cards";
import { ACCIDENTAL, CLEF, NOTE_NAME, OCTAVE, PITCH } from "../pitch";
import { INSTRUMENT, INSTRUMENT_CARD } from "./instrument";
import { getInstrumentCard } from "./utils";

export const FLUTE_A_SHARP_B_FLAT_4: INSTRUMENT_CARD = {
  instrument: INSTRUMENT.FLUTE,
  frequency: 448,
  cardNumber: 1,
  noteCards: [
    {
      clef: CLEF.BASS,
      accidental: ACCIDENTAL.NATURAL,
      noteName: NOTE_NAME.F_NATURAL,
      octave: OCTAVE.FIRST,
      pitch: PITCH.A_SHARP_B_FLAT_4,
    },
    {
      clef: CLEF.BASS,
      accidental: ACCIDENTAL.NATURAL,
      noteName: NOTE_NAME.A_FLAT,
      octave: OCTAVE.FOURTH,
      pitch: PITCH.A_SHARP_B_FLAT_4,
    },
  ],
};
export const FLUTE_A_NATURAL_4: INSTRUMENT_CARD = {
  instrument: INSTRUMENT.FLUTE,
  frequency: 440,
  cardNumber: 2,
  noteCards: [
    {
      clef: CLEF.TREBLE,
      accidental: ACCIDENTAL.NATURAL,
      noteName: NOTE_NAME.A_NATURAL,
      octave: OCTAVE.FOURTH,
      pitch: PITCH.A_NATURAL_4,
    },
  ],
};

const getTestCard = (
  cardMap: CARD_ACCIDENTAL_MAP | undefined,
  cardNumber: number
) => getInstrumentCard(cardMap, INSTRUMENT.FLUTE, cardNumber);

export const NATURAL_NOTES: INSTRUMENT_CARD[] = [
  getTestCard(TREBLE_CARDS[PITCH.C_NATURAL_4], 1),
  getTestCard(TREBLE_CARDS[PITCH.D_NATURAL_4], 2),
  getTestCard(TREBLE_CARDS[PITCH.E_NATURAL_4], 3),
  getTestCard(TREBLE_CARDS[PITCH.F_NATURAL_4], 4),
  getTestCard(TREBLE_CARDS[PITCH.G_NATURAL_4], 5),
  getTestCard(TREBLE_CARDS[PITCH.A_NATURAL_4], 6),
  getTestCard(TREBLE_CARDS[PITCH.B_NATURAL_4], 7),
];

export const ACCIDENTALS_NOTES: INSTRUMENT_CARD[] = [
  getTestCard(TREBLE_CARDS[PITCH.C_SHARP_D_FLAT_4], 1),
  getTestCard(TREBLE_CARDS[PITCH.D_SHARP_E_FLAT_4], 2),
  getTestCard(TREBLE_CARDS[PITCH.F_SHARP_G_FLAT_4], 3),
  getTestCard(TREBLE_CARDS[PITCH.G_SHARP_A_FLAT_4], 4),
  getTestCard(TREBLE_CARDS[PITCH.A_SHARP_B_FLAT_4], 5),
];
