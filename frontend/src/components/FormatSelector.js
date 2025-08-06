import React from "react";
import {PAPER_FORMATS} from "../constants/paperFormats";
import {textStyles} from "../styles/textStyles";
import {inputFieldStyle} from "../styles/inputFields";

const FormatSelector = ({selectedFormat, setSelectedFormat}) => {
    return (
        <div>
            <label style={{flex: "1 1 180px", minWidth: 180}}>
                <div style={textStyles}>
                    Wybierz format arkusza:
                </div>
                <select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    style={inputFieldStyle}
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

export default FormatSelector;
