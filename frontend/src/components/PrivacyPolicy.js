// PrivacyPolicy.js
import React from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

export default function PrivacyPolicy({ sx }) {
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();

  // Jeśli treść jest tablicą w JSON (np. ["linia1", "linia2"])
  const content = t("privacyPolicy_content", { returnObjects: true });

  return (
    <>
      <Box
        sx={{
          cursor: "pointer",
          textDecoration: "underline",
          color: "primary.main",
          ...sx,
        }}
        onClick={() => setOpen(true)}
      >
        {t("privacyPolicy_title")}
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {t("privacyPolicy_title")}
        </DialogTitle>

        <DialogContent dividers>
          {t("privacyPolicy_content", { returnObjects: true }).map((line, i) => (
            <Typography
              key={i}
              variant="body1"
              paragraph
              sx={{ textAlign: "justify" }}
            >
              {line}
            </Typography>
          ))}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)} variant="contained">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
