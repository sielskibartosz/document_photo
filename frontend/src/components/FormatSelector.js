import React from "react";
import { PAPER_FORMATS } from "../constants/paperFormats";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Tooltip,
  IconButton,
} from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const FormatSelector = ({ selectedFormat, setSelectedFormat }) => {
  const getFormatDescription = (format) => {
    const formatData = PAPER_FORMATS[format];
    return formatData ? `Format arkusza to rozmiar kartki papieru na ktorej umieszczone bedzie zdjęcie.` : "";
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, width: '100%' }}>
      <FormControl sx={{ minWidth: 160 }} size="small">
        <InputLabel id="format-select-label">Wybierz format arkusza</InputLabel>
        <Select
          labelId="format-select-label"
          value={selectedFormat}
          label="Wybierz format arkusza"
          onChange={(e) => setSelectedFormat(e.target.value)}
          sx={{ pr: '36px' }} // padding po prawej, by zrobić miejsce na ikonę
        >
          {Object.keys(PAPER_FORMATS).map((key) => (
            <MenuItem key={key} value={key}>
              {key}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Ikona "i" obok Selecta */}
      <Tooltip title={getFormatDescription(selectedFormat)} arrow placement="top">
        <IconButton size="small" aria-label="info" sx={{ p: 0 }}>
          <InfoOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default FormatSelector;
