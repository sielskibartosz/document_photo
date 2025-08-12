import React from "react";
import { Box, TextField, Tooltip, IconButton } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const AspectInput = ({ value, onChange, placeholder, tooltip }) => {
  return (
    <Box sx={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 1,
    width: '100%' }}>
      <TextField
        label="Wymiary zdjęcia"
        variant="outlined"
        size="small"
        value={value}
        onChange={onChange}
        InputProps={{ sx: { height: 40 } }}
        inputProps={{ style: { fontSize: 16, fontFamily: "Roboto, sans-serif" } }}
        placeholder={placeholder}
        fullWidth
      />
      <Tooltip title={tooltip} arrow placement="top">
        <IconButton
          size="small"
          aria-label="info"
          sx={{ padding: 0 }}
        >
          <InfoOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default AspectInput;
