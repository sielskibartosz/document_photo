// components/Donate.js
import React, { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Donate() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDonate = () => {
    window.open("https://buy.stripe.com/fZu28qdDZ5Si78rboB63K00", "_blank");
    handleClose();
  };

  return (
    <>
      {/* Główny przycisk */}
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{
          ml: 2,
          backgroundColor: "#f7b077",
          color: "#fff",
          "&:hover": { backgroundColor: "#f59e0b" },
          fontSize: "0.875rem"
        }}
      >
        {t("donateHeader")}
      </Button>

      {/* Popup */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t("donateTitle")}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {t("donateDescription")}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            {t("cancel")}
          </Button>
          <Button
            onClick={handleDonate}
            variant="contained"
            sx={{
              backgroundColor: "#f7b077",
              color: "#fff",
              "&:hover": { backgroundColor: "#f59e0b" }
            }}
          >
            {t("donate")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
