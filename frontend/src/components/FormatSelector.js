import React, { useState } from "react";
import { PAPER_FORMATS } from "../constants/paperFormats";
import { useTranslation } from "react-i18next";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const FormatSelector = ({ selectedFormat, setSelectedFormat }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const FORMAT_TOOLTIP = t("format_info");

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 1,
        width: "100%",
        maxWidth: 300,
        mx: "auto",
      }}
    >
      <FormControl size="small" sx={{ flexGrow: 1 }}>
        <InputLabel id="format-select-label" shrink>
          {t("format")}
        </InputLabel>
        <Select
          labelId="format-select-label"
          value={selectedFormat}
          label={t("format")}
          onChange={(e) => setSelectedFormat(e.target.value)}
        >
          {Object.keys(PAPER_FORMATS).map((key) => (
            <MenuItem key={key} value={key}>
              {key}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Ikona info zawsze działa po kliknięciu */}
      <IconButton
        size="small"
        aria-label="info"
        sx={{ p: 0, color: "primary.main" }}
        onClick={() => setOpen(true)}
      >
        <InfoOutlinedIcon fontSize="small" />
      </IconButton>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{t("format")}</DialogTitle>
        <DialogContent>{FORMAT_TOOLTIP}</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>{t("close")}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FormatSelector;
