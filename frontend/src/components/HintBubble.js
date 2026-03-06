import React, { useEffect } from "react";
import { Box, Typography, Link } from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const HintBubble = ({ open, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 9000);

    return () => clearTimeout(timer);
  }, [open, onClose]);

  if (!open) return null;

  const handleFotoTipsClick = () => {
    // nawigacja wewnętrzna zamiast window.location.href
    navigate("/foto-tips", { replace: false });
    // replace: false -> można wrócić do poprzedniej strony i zachować stan
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 40,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0.5,
        zIndex: 2000,
        animation: "fadeIn 0.4s ease",
        "@keyframes fadeIn": {
          from: { opacity: 0, transform: "translateY(20px) translateX(-50%)" },
          to: { opacity: 1, transform: "translateY(0) translateX(-50%)" },
        },
        backgroundColor: "#1f2937",
        padding: "12px 18px",
        borderRadius: 16,
        boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        maxWidth: 380,
        textAlign: "center",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontSize: 14,
          color: "#ffffff",
          lineHeight: 1.3,
        }}
      >
        {t("hint_bubble.text", "This is a hint!")}
      </Typography>

      <Link
        component="button"
        underline="hover"
        onClick={handleFotoTipsClick}
        sx={{
          fontWeight: 600,
          color: "#60a5fa",
          fontSize: 14,
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
          "&:hover": { color: "#93c5fd" },
        }}
      >
        {t("hint_bubble.link", "How it works")}
        <OpenInNewIcon sx={{ fontSize: 16 }} />
      </Link>
    </Box>
  );
};

export default HintBubble;