import { CLARINET_CARD_MAP } from "./clarinet";
import { EUPHONIUM_CARD_MAP } from "./euphonium";
import { FLUTE_CARD_MAP } from "./flute";
import { HORN_CARD_MAP } from "./horn";
import { INSTRUMENT, INSTRUMENT_CARD_LEVEL_MAP } from "./instrument";
import { LEVEL } from "./level";
import { SAXOPHONE_CARD_MAP } from "./saxophone";
import { TROMBONE_CARD_MAP } from "./trombone";
import { TRUMPET_CARD_MAP } from "./trumpet";
import { TUBA_CARD_MAP } from "./tuba";

const getCardMap = (instrument: INSTRUMENT): INSTRUMENT_CARD_LEVEL_MAP => {
  switch (instrument) {
    case INSTRUMENT.FLUTE:
      return FLUTE_CARD_MAP;
    case INSTRUMENT.CLARINET:
      return CLARINET_CARD_MAP;
    case INSTRUMENT.SAXOPHONE:
      return SAXOPHONE_CARD_MAP;
    case INSTRUMENT.TRUMPET:
      return TRUMPET_CARD_MAP;
    case INSTRUMENT.HORN:
      return HORN_CARD_MAP;
    case INSTRUMENT.TROMBONE:
      return TROMBONE_CARD_MAP;
    case INSTRUMENT.EUPHONIUM:
      return EUPHONIUM_CARD_MAP;
    case INSTRUMENT.TUBA:
      return TUBA_CARD_MAP;
    default:
      return {}; // TODO: throw eventually
  }
};

export const getCardsForQuiz = (instrument: INSTRUMENT, level: LEVEL) => {
  return getCardMap(instrument)[level] ?? []; // TODO: throw eventually
};

export const getLevelCount = (instrument: INSTRUMENT) => {
  return Object.keys(getCardMap(instrument)).length;
};
