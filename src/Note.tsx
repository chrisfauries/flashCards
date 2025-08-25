import React, { useRef, useEffect } from "react";
import {
  Renderer,
  Stave,
  StaveNote,
  Voice,
  Formatter,
  Beam,
  Accidental,
} from "vexflow";
import { CARD } from "./data/cards";
import { ACCIDENTAL, CLEF, NOTE_NAME } from "./data/pitch";

const getKey = (card: CARD) =>
  `${NOTE_NAME[card.noteName].slice(0, 1)}/${card.octave + 1}`;

interface Props {
  card: CARD;
}

const getClef = (card: CARD) => {
  switch (card.clef) {
    case CLEF.BASS:
      return "bass";
    case CLEF.TREBLE:
    default:
      return "treble";
  }
};

const Note: React.FC<Props> = ({ card }) => {
  // Create a ref to attach to the div that will contain the score
  const containerRef = useRef<HTMLCanvasElement>(null);

  // This useEffect hook runs once after the component mounts
  useEffect(() => {
    // Ensure the container is available
    if (containerRef.current) {
      containerRef.current.innerHTML = "";

      const renderer = new Renderer(
        containerRef.current,
        Renderer.Backends.CANVAS
      );

      renderer.resize(440, 300);
      const context = renderer.getContext();

      context.scale(2, 2);

      context.clearRect(
        0,
        0,
        containerRef.current.width,
        containerRef.current.height
      );

      const stave = new Stave(20, 20, 180);

      stave.setDefaultLedgerLineStyle({
        fillStyle: "black",
        strokeStyle: "solid",
        lineWidth: 1,
      });

      stave.addClef(getClef(card));

      stave.setNumLines(5);

      stave.setContext(context).draw();

      const staveNote = new StaveNote({
        keys: [getKey(card)],
        duration: "q",
        alignCenter: true,
        autoStem: true,
        clef: getClef(card),
      });

      switch (card.accidental) {
        case ACCIDENTAL.FLAT:
          staveNote.addModifier(new Accidental("b"));
          break;
        case ACCIDENTAL.SHARP:
          staveNote.addModifier(new Accidental("#"));
          break;
        case ACCIDENTAL.NATURAL:
        default:
          break;
      }

      const notes = [staveNote];

      const voice = new Voice({ numBeats: 1, beatValue: 4 });
      voice.addTickables(notes);

      const formatter = new Formatter();

      formatter.joinVoices([voice]).format([voice], 90);

      const beams = Beam.generateBeams(notes);

      voice.draw(context, stave);
      beams.forEach((beam) => beam.setContext(context).draw());
    }
  }, [card]);

  return (
    <div className="bg-white">
      <canvas ref={containerRef} />
    </div>
  );
};

export default Note;
