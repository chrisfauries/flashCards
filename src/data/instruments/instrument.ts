import { CARD } from "../cards";
import {  NOTE_NAME } from "../pitch";
import { LEVEL } from "./level";

export enum INSTRUMENT {
  FLUTE = "Flute",
  CLARINET = "Clarinet",
  SAXOPHONE = "Saxophone",
  OBOE = "Oboe",
  BASSOON = "Bassoon",
  TRUMPET = "Trumpet",
  HORN = "Horn",
  TROMBONE = "Trombone",
  EUPHONIUM = "Euphonium",
  TUBA = "Tuba",
  PERCUSSION = "Percussion"
}

export interface INSTRUMENT_CARD {
  noteCards: CARD[];
  instrument: INSTRUMENT;
  cardNumber: number;
  frequency: number;
}

export interface MISSED_INSTRUMENT_CARD extends INSTRUMENT_CARD {
  givenAnswer: NOTE_NAME[];
}

export type INSTRUMENT_CARD_NUMBER_MAP = Record<
  INSTRUMENT_CARD["cardNumber"],
  INSTRUMENT_CARD
>;

export type INSTRUMENT_CARD_LEVEL_MAP = Partial<Record<
  LEVEL,
  INSTRUMENT_CARD[]
>>;

