import React from "react";
import {textStyles} from "../styles/textStyles";
import {TAB_DESCTIPTION,TABS} from "../constants/tabs";
import {inputFieldStyle} from "../styles/inputFields";


const TabContent = ({ tabKey, aspectInput, setAspectInput }) => {
  const { text, image } = TAB_DESCTIPTION[tabKey] || {};

  return (
      <div>
    <div style={{ marginBottom: 24, textAlign: "center" }}>
      {image && (
        <img
          src={image}
          alt={`Przykład zdjęcia - ${tabKey}`}
          style={{ maxWidth: 400, marginBottom: 12, borderRadius: 8 }}
        />
      )}
      {text && (
        <div style={textStyles}>
          {text}
        </div>
      )}
    </div>
      <div>
  {tabKey === "custom" && (
    <div style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
      <label style={{ ...textStyles, marginBottom: 6 }}>
        Wymiary zdjęcia (mm):
      </label>
      <input
        type="text"
        value={aspectInput}
        onChange={(e) => setAspectInput(e.target.value)}
        placeholder = {aspectInput}
        style={inputFieldStyle}
        onFocus={(e) => (e.target.style.borderColor = "#3498db")}
        onBlur={(e) => (e.target.style.borderColor = "#bdc3c7")}
      />
    </div>
  )}
</div>

      </div>

  );
};

export default TabContent;
