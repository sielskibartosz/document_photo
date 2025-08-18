import React from "react";
import { PAPER_FORMATS } from "../constants/paperFormats";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation(); // <- musi być wewnątrz komponentu

  const FORMAT_TOOLTIP = t("format_info"); // tłumaczenie tooltipa

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
          {t("format")}
        </InputLabel>
        <Select
          labelId="format-select-label"
          value={selectedFormat}
          label={t("format")}
          onChange={(e) => setSelectedFormat(e.target.value)}
          sx={{
            textAlign: "left",
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: { textAlign: "left" },
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
