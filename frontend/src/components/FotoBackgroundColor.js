import React, { useState } from "react";
import { Box, Typography, Popover, Button } from "@mui/material";
import { HexColorPicker } from "react-colorful";
import { useTranslation } from "react-i18next";

const FotoBackgroundColor = ({ color, onChange }) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const id = open ? "color-popover" : undefined;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 160 }}>
      <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
        {t("color_choice")}
      </Typography>

      <Button
        aria-describedby={id}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          width: 36,
          height: 36,
          minWidth: 36,
          padding: 0,
          borderRadius: "4px",
          border: "1px solid #ccc",
          backgroundColor: color,
        }}
      />

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{ p: 1 }}>
          <HexColorPicker color={color} onChange={onChange} />
        </Box>
      </Popover>
    </Box>
  );
};

export default FotoBackgroundColor;
