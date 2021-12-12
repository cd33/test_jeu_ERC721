import React from "react";
import { parts } from "./parts";

const CharacterRenderer = ({ character = null, size = 200, style }) => {
  if (!character) {
    return null;
  }

  let dnaStr = String(character.dna);

  while (dnaStr.length < 16) dnaStr = "0" + dnaStr;

  let characterDetails = {
    bg: dnaStr.substring(0, 2) % 3,
    hair: dnaStr.substring(2, 4) % 4,
    head: dnaStr.substring(4, 6) % 4,
    upbody: dnaStr.substring(6, 8) % 4,
    lowbody: dnaStr.substring(8, 10) % 4,
    shoes: dnaStr.substring(10, 12) % 4,
    // addonMouth3: dnaStr.substring(12, 14) % 5,
  };

  const characterStyle = {
    width: "100%",
    height: "100%",
    position: "absolute",
  };

  return (
    <div
      style={{
        minWidth: size,
        minHeight: size,
        background: "blue",
        position: "relative",
        ...style,
      }}
    >
      <img alt={"bg"} src={parts.bg[characterDetails.bg]} style={characterStyle} />
      <img alt={"hair"} src={parts.hair[characterDetails.hair]} style={characterStyle} />
      <img alt={"head"} src={parts.head[characterDetails.head]} style={characterStyle} />
      <img alt={"upbody"} src={parts.upbody[characterDetails.upbody]} style={characterStyle} />
      <img alt={"lowbody"} src={parts.lowbody[characterDetails.lowbody]} style={characterStyle} />
      <img alt={"shoes"} src={parts.shoes[characterDetails.shoes]} style={characterStyle} />
    </div>
  );
};

export default CharacterRenderer;