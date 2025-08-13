// w tym samym pliku lub w osobnym constants.js


import React from "react";
import { Box, TextField, Tooltip, IconButton } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const ASPECT_TOOLTIP = "Szerokość/Wysokość [mm]";
const AspectInput = ({ value, onChange, placeholder }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 1,
        width: '100%',
      }}
    >
      <TextField
        label="Wymiary zdjęcia [mm]"
        variant="outlined"
        size="small"
        value={value}
        onChange={onChange}
        InputProps={{ sx: { height: 40 } }}
        inputProps={{ style: { fontSize: 16, fontFamily: "Roboto, sans-serif" } }}
        placeholder={placeholder}
        fullWidth
      />
      <Tooltip title={ASPECT_TOOLTIP} arrow placement="top">
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

export default AspectInput;
