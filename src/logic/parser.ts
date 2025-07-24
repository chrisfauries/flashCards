import { ACCIDENTAL, NOTE_NAME } from "../data/pitch";

export const parseNoteNames = (transcript: string) => {
  if (transcript.length === 0) {
    // clear the letter/accidental caches
    // if they contained the wrong answer, mark wrong and advance the card. clear transcript
    // if it contains partial right answer, save and wait for rest of the answer.
    return [];
  }

  // Up-front, look for common mis-translated edge-cases
  // fall-through if none match
  switch (true) {
    case /sea(\s)?(shop|shell|shore|sha) d(\s|-)fla(t|p)(s)?/.test(transcript):
    case /(sea(\s)?shark|sea(\s)?shock) d(\s|-)fla(t|p)/.test(transcript):
    case /(deflate|deflect)\sc(\s|-)(sharp|#)/.test(transcript):
    case /t(\s|-)(flat|fletc)\s(c\s|c-)?sharp/.test(transcript):
      return [NOTE_NAME.C_SHARP, NOTE_NAME.D_FLAT];
    case /((a(\s|-)sharpie)|(asian))\s?(b(\s|-))?fla(t|p)/i.test(transcript):
      return [NOTE_NAME.A_SHARP, NOTE_NAME.B_FLAT];
    case /g(\s|-)sharp(a|ay|ie)?\s?(a(\s|-))?fla(t|p)/i.test(transcript):
    case /g(\s|-)sharp\sbay\sfla(t|p)/i.test(transcript):
    case /g(\s|-)sharp\seggplant/i.test(transcript):
    case /(a|hey)\s(flat|fletch|fletcher|fletchy)\ssharp/i.test(transcript):
      return [NOTE_NAME.G_SHARP, NOTE_NAME.A_FLAT];
    case /d(\s|-)sharp(y|ie)\s?(e(\s|-))?(-)?fla(t|p)/i.test(transcript):
    case /t(\s|-)(sharp|shirt)\s(e(\s|-))?(-)?fla(t|p)/i.test(transcript):
    case /e(\s|-)(flood|flat)\sd(\s|-)(sharp|shirt)/i.test(transcript):
      return [NOTE_NAME.D_SHARP, NOTE_NAME.E_FLAT];
    case /(accept|except|extra)\sg(\s|-)fla(t|p)/.test(transcript):
    case /chi\sfla(t|p)\sf(\s|-)(sharp|#)/.test(transcript):
      return [NOTE_NAME.F_SHARP, NOTE_NAME.G_FLAT];
    default:
    //fall-through
  }

  const commonMatchRegex = new RegExp(
    "(\\b|^)(a|hey|b|be|c|see|sea|z|d|dee|e|f|g)(\\s+|-)?(flat|flap|flot|fled|flood|sharp|shirt|shark|#|natural)?(\\b|$)",
    "gi"
  );
  if (commonMatchRegex.test(transcript)) {
    commonMatchRegex.lastIndex = 0;

    const matches = Array.from(transcript.matchAll(commonMatchRegex));
    if (matches.length > 2) {
      console.warn("There should not be two matches for a given note set");
    }

    return matches
      .map((match) => {
        const letterMatch = match[2]?.toUpperCase();
        const accidentalMatch = match[4]?.toUpperCase();

        let accidental: ACCIDENTAL;
        switch (accidentalMatch) {
          case "FLAT":
          case "FLAP":
          case "FLOT":
          case "FLED":
          case "FLOOD":
            accidental = ACCIDENTAL.FLAT;
            break;
          case "#":
          case "SHARP":
          case "SHIRT":
          case "SHARK":
            accidental = ACCIDENTAL.SHARP;
            break;
          case "NATURAL":
          default:
            accidental = ACCIDENTAL.NATURAL;
            break;
        }

        switch (letterMatch) {
          case "HEY":
          case "A": {
            switch (accidental) {
              case ACCIDENTAL.FLAT:
                return NOTE_NAME.A_FLAT;
              case ACCIDENTAL.SHARP:
                return NOTE_NAME.A_SHARP;
              case ACCIDENTAL.NATURAL:
              default:
                return NOTE_NAME.A_NATURAL;
            }
          }
          case "BE":
          case "B": {
            switch (accidental) {
              case ACCIDENTAL.FLAT:
                return NOTE_NAME.B_FLAT;
              case ACCIDENTAL.NATURAL:
              default:
                return NOTE_NAME.B_NATURAL;
            }
          }
          case "Z":
          case "SEE":
          case "SEA":
          case "C": {
            switch (accidental) {
              case ACCIDENTAL.SHARP:
                return NOTE_NAME.C_SHARP;
              case ACCIDENTAL.NATURAL:
              default:
                return NOTE_NAME.C_NATURAL;
            }
          }
          case "DEE":
          case "D": {
            switch (accidental) {
              case ACCIDENTAL.SHARP:
                return NOTE_NAME.D_SHARP;
              case ACCIDENTAL.FLAT:
                return NOTE_NAME.D_FLAT;
              case ACCIDENTAL.NATURAL:
              default:
                return NOTE_NAME.D_NATURAL;
            }
          }
          case "E": {
            switch (accidental) {
              case ACCIDENTAL.FLAT:
                return NOTE_NAME.E_FLAT;
              case ACCIDENTAL.NATURAL:
              default:
                return NOTE_NAME.E_NATURAL;
            }
          }
          case "F": {
            switch (accidental) {
              case ACCIDENTAL.SHARP:
                return NOTE_NAME.F_SHARP;
              case ACCIDENTAL.NATURAL:
              default:
                return NOTE_NAME.F_NATURAL;
            }
          }
          case "G": {
            switch (accidental) {
              case ACCIDENTAL.SHARP:
                return NOTE_NAME.G_SHARP;
              case ACCIDENTAL.FLAT:
                return NOTE_NAME.G_FLAT;
              case ACCIDENTAL.NATURAL:
              default:
                return NOTE_NAME.G_NATURAL;
            }
          }

          default:
            break;
        }
      })
      .filter((x) => x !== undefined) as NOTE_NAME[];
  }

  return [];
};
