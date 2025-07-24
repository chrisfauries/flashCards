import { SpeechRecognitionOptions } from "react-speech-recognition";
import { NOTE_NAME } from "../data/pitch";

const BASE_COMMANDS: Array<
  Exclude<SpeechRecognitionOptions["commands"], undefined>[0] & {
    noteNames: NOTE_NAME[];
  }
> = [
  {
    command: "f",
    callback: () => {},
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.F_NATURAL],
  },
  {
    command: "f natural",
    callback: () => {},
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.F_NATURAL],
  },
  {
    command: "f sharp",
    callback: () => {},
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.F_SHARP],
  },
  {
    command: "f sharp g flat",
    callback: () => {},
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.F_SHARP, NOTE_NAME.G_FLAT],
  },
  {
    command: "g flat f sharp",
    callback: () => {},
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.G_FLAT, NOTE_NAME.F_SHARP],
  },
  {
    command: "g flat",
    callback: () => {},
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.G_FLAT],
  },
  {
    command: "g",
    callback: () => {},
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.G_NATURAL],
  },
  {
    command: "g natural",
    callback: () => {},
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.G_NATURAL],
  },
  {
    command: "g sharp",
    callback: () => {},
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.G_SHARP],
  },
  {
    command: "g sharp a flat",
    callback: () => {},
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.G_SHARP, NOTE_NAME.A_FLAT],
  },
  {
    command: "a flat g sharp",
    callback: () => {},
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.A_FLAT, NOTE_NAME.G_SHARP],
  },
  {
    command: "a flat",
    callback: () => {},
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.A_FLAT],
  },
  {
    command: "a",
    callback: () => {},
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.A_NATURAL],
  },
  {
    command: "a natural",
    callback: () => {},
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.A_NATURAL],
  },
  {
    command: "hey",
    callback: () => {},
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.A_NATURAL],
  },
  {
    command: "a sharp",
    callback: () => {},
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.A_SHARP],
  },
  {
    command: "a sharp b flat",
    callback: () => {},
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.A_SHARP, NOTE_NAME.B_FLAT],
  },
  {
    command: "b flat a sharp",
    callback: () => {},
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.B_FLAT, NOTE_NAME.A_SHARP],
  },
  {
    command: "b flat",
    callback: () => {},
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.B_FLAT],
  },
  {
    command: "b",
    callback: () => {},
    fuzzyMatchingThreshold: 0.6,
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.B_NATURAL],
  },
  {
    command: "b natural",
    callback: () => {},
    fuzzyMatchingThreshold: 0.6,
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.B_NATURAL],
  },
  {
    command: "be",
    callback: () => {},
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.B_NATURAL],
  },
  {
    command: "bee",
    callback: () => {},
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.B_NATURAL],
  },
  {
    command: "c",
    callback: () => {},
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.C_NATURAL],
  },
  {
    command: "see",
    callback: () => {},
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.C_NATURAL],
  },
  {
    command: "c natural",
    callback: () => {},
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.C_NATURAL],
  },
  {
    command: "c sharp",
    callback: () => {},
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.C_SHARP],
  },
  {
    command: "c sharp d flat",
    callback: () => {},
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.C_SHARP, NOTE_NAME.D_FLAT],
  },
  {
    command: "d flat c sharp",
    callback: () => {},
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.D_FLAT, NOTE_NAME.C_SHARP],
  },
  {
    command: "d flat",
    callback: () => {},
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.D_FLAT],
  },
  {
    command: "d",
    callback: () => {},
    fuzzyMatchingThreshold: 0.6,
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.D_NATURAL],
  },
  {
    command: "d natural",
    callback: () => {},
    fuzzyMatchingThreshold: 0.6,
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.D_NATURAL],
  },
  {
    command: "d sharp",
    callback: () => {},
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.D_SHARP],
  },
  {
    command: "d sharp e flat",
    callback: () => {},
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.D_SHARP, NOTE_NAME.E_FLAT],
  },
  {
    command: "e flat d sharp",
    callback: () => {},
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.E_FLAT, NOTE_NAME.D_SHARP],
  },
  {
    command: "e flat",
    callback: () => {},
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.E_FLAT],
  },
  {
    command: "e",
    callback: () => {},
    fuzzyMatchingThreshold: 0.6,
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.E_NATURAL],
  },
  {
    command: "e natural",
    callback: () => {},
    fuzzyMatchingThreshold: 0.6,
    bestMatchOnly: true,
    noteNames: [NOTE_NAME.E_NATURAL],
  },
];

export const constructCommands = (
  updater: (spokenNoteNames: NOTE_NAME[]) => void
): SpeechRecognitionOptions["commands"] =>
  BASE_COMMANDS.map((command) => ({
    ...command,
    callback: () => updater(command.noteNames),
  }));
