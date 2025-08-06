import React from "react";
import {PAPER_FORMATS} from "../constants/paperFormats";
import {textStyles} from "../styles/textStyles";

const PrintFormatSelector = ({ selectedFormat, setSelectedFormat }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: 24,
        flexWrap: "wrap",
        marginBottom: 10,
        justifyContent: "center",
      }}
    >
      <label style={{ flex: "1 1 180px", minWidth: 180 }}>
        <div
          style={textStyles}
        >
          Wybierz format arkusza:
        </div>
        <select
          value={selectedFormat}
          onChange={(e) => setSelectedFormat(e.target.value)}
          style={{
            width: "20%",
            padding: "8px 12px",
            fontSize: 15,
            borderRadius: 6,
            border: "1.5px solid #bdc3c7",
            cursor: "pointer",
            transition: "border-color 0.3s",
          }}
        >
          {Object.keys(PAPER_FORMATS).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default PrintFormatSelector;
