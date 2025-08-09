import React from "react";
import { PAPER_FORMATS } from "../constants/paperFormats";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";

const FormatSelector = ({ selectedFormat, setSelectedFormat }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <FormControl sx={{ minWidth: 180 }} size="small">
        <InputLabel id="format-select-label">Wybierz format arkusza</InputLabel>
        <Select
          labelId="format-select-label"
          value={selectedFormat}
          label="Wybierz format arkusza"
          onChange={(e) => setSelectedFormat(e.target.value)}
        >
          {Object.keys(PAPER_FORMATS).map((key) => (
            <MenuItem key={key} value={key}>
              {key}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default FormatSelector;
