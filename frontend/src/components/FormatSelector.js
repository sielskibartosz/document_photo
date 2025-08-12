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
    return formatData ? `Format arkusza to rozmiar kartki papieru na której umieszczone będzie zdjęcie.` : "";
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 1,
      width: '100%',
      maxWidth: 300,           // maksymalna szerokość całego kontenera
      mx: "auto",
    }}>
      <FormControl
        size="small"
        sx={{ minWidth: 160, maxWidth: 220, flexShrink: 0 }}  // ustalamy szerokość selecta
      >
        <InputLabel id="format-select-label">Format arkusza</InputLabel>
        <Select
          labelId="format-select-label"
          value={selectedFormat}
          label="Format arkusza"
          onChange={(e) => setSelectedFormat(e.target.value)}
        >
          {Object.keys(PAPER_FORMATS).map((key) => (
            <MenuItem key={key} value={key}>
              {key}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Tooltip title={getFormatDescription(selectedFormat)} arrow placement="top">
        <IconButton
          size="small"
          aria-label="info"
          sx={{ p: 0, color: 'primary.main', zIndex: 10 }}
        >
          <InfoOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default FormatSelector;
