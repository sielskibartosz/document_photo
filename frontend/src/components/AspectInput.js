import React, { useState } from "react";
import { Box, TextField, Tooltip, IconButton, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useTranslation } from "react-i18next";

const AspectInput = ({ value, onChange, placeholder }) => {
  const { t } = useTranslation();
  const ASPECT_TOOLTIP = t("aspect_tooltip", "Szerokość/Wysokość [mm]");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const val = e?.target?.value ?? ""; // <- zabezpieczenie przed undefined

    // Pozwól tylko cyfry i jeden separator '/'
    if (/^\d{0,3}(\/\d{0,3})?$/.test(val)) {
      onChange(val);

      // Walidacja poprawności formatu XX/YY
      if (val && !/^\d{1,3}\/\d{1,3}$/.test(val)) {
        setError(t("invalid_aspect", "Wpisz w formacie XX/YY"));
      } else {
        setError("");
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          label={t("foto_size", "Wymiary zdjęcia [mm]")}
          variant="outlined"
          size="small"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          error={!!error}
          fullWidth
        />
        <Tooltip title={ASPECT_TOOLTIP} arrow placement="top">
          <IconButton size="small" aria-label="info" sx={{ p: 0, color: 'primary.main' }}>
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      {error && <Typography variant="caption" color="error">{error}</Typography>}
    </Box>
  );
};

export default AspectInput;
