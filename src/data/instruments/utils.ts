import { CARD_ACCIDENTAL_MAP } from "../cards";
import { getFrequency } from "../frequency";
import { getPitch } from "../pitch";
import { INSTRUMENT, INSTRUMENT_CARD } from "./instrument";

export const getInstrumentCard = (
  cardMap: CARD_ACCIDENTAL_MAP = {},
  instrument: INSTRUMENT,
  cardNumber: number
): INSTRUMENT_CARD => {
  if (!Object.keys(cardMap).length) {
    throw new Error("missing card");
  }
  return {
    noteCards: Object.values(cardMap),
    instrument,
    cardNumber,
    frequency: getFrequency(instrument, getPitch(cardMap))
  };
};