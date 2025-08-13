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

// Stała z opisem tooltipa w tym samym pliku
const FORMAT_TOOLTIP = "Rozmiar kartki papieru na której drukowaneZdjęcie będzie zdjęcie.";

const FormatSelector = ({ selectedFormat, setSelectedFormat }) => {
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 1,
      width: '100%',
      maxWidth: 300,
      mx: "auto",
    }}>
      <FormControl size="small" sx={{ flexGrow: 1 }}>
              <InputLabel id="format-select-label" shrink>
                Format arkusza
              </InputLabel>
              <Select
                labelId="format-select-label"
                value={selectedFormat}
                label="Format arkusza"
                onChange={(e) => setSelectedFormat(e.target.value)}
                sx={{
                  textAlign: "left",           // wyrównanie samego Select
                  "& .MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",      // wyrównanie wertykalne do środka
                    justifyContent: "flex-start", // wyrównanie poziome do lewej
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: { textAlign: "left" }, // wyrównanie w liście
                  },
                }}
              >
                {Object.keys(PAPER_FORMATS).map((key) => (
                  <MenuItem key={key} value={key}>
                    {key}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

      <Tooltip title={FORMAT_TOOLTIP} arrow placement="top">
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
