import React from "react";
import {textStyles} from "../styles/textStyles";

const PrintFormatSelector = ({ selectedFormat, setSelectedFormat }) => {
  const PAPER_FORMATS = {
    "9/13 cm": { width: 8.9, height: 12.7 },
    A4: { width: 21, height: 29.7 },
  };

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
          style={{textStyles}}
        >
          Format drukowanej kartki:
        </div>
        <select
          value={selectedFormat}
          onChange={(e) => setSelectedFormat(e.target.value)}
          style={{
            width: "15%",
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
