export enum MODE {
  TIME_TRIAL_MODE = "Time Trial Mode",
  CHALLENGE_MODE = "Challenge Mode",
  MANUAL_MODE = "Manual Mode",
  NOTE_TAP_MODE = "Note Tap Mode",
  STAFF_TAP_MODE = "Staff Tap Mode",
}

export const TAP_MODES = [MODE.NOTE_TAP_MODE, MODE.STAFF_TAP_MODE];

export const isTapMode = (mode: MODE) => TAP_MODES.includes(mode);
