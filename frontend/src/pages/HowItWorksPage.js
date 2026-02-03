import { Box, Typography, ThemeProvider, CssBaseline, useMediaQuery, IconButton, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { darkTheme } from "../styles/theme";
import { useTranslation } from 'react-i18next';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CropIcon from "@mui/icons-material/Crop";
import UploadIcon from '@mui/icons-material/Upload';
import PreviewIcon from "@mui/icons-material/Visibility";
import PaymentIcon from "@mui/icons-material/Payment";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";

const HowItWorksPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  // Pobieranie kroków z tłumaczeń
  const steps = t("how_it_works.steps", { returnObjects: true });

  // Ikony dla kroków
  const stepIcons = [AspectRatioIcon,UploadIcon, CropIcon, PreviewIcon, PaymentIcon, DownloadIcon];

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          p: isSmallScreen ? 2 : 4,
          width: isSmallScreen ? "95vw" : "80vw",
          margin: "20px auto",
          color: darkTheme.palette.text.primary,
          background:
            darkTheme.palette.mode === "dark"
              ? "linear-gradient(135deg, #1f2937 0%, #374151 100%)"
              : "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          borderRadius: 3,
          boxShadow: darkTheme.shadows[4],
          gap: 3,
          position: "relative",
        }}
      >
        {/* Strzałka wstecz */}
        <IconButton
          onClick={() => navigate("/")}
          sx={{ position: "absolute", top: 12, left: 12, color: "primary.main" }}
          aria-label="back"
        >
          <ArrowBackIcon fontSize="medium" />
        </IconButton>

        {/* Header */}
        <Typography variant={isSmallScreen ? "h5" : "h4"} fontWeight={600}>
          {t("how_it_works.title")}
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700 }}>
          {t("how_it_works.subtitle")}
        </Typography>

        {/* Steps */}
        <Box sx={{ maxWidth: 700, textAlign: "left", mt: 3 }}>
          {steps.map((step, index) => {
            const Icon = stepIcons[index] || UploadFileIcon; // fallback
            return (
              <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Icon sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="body1">
                  <strong>{index + 1}.</strong> {step}
                </Typography>
              </Box>
            );
          })}

          {/* Punkt 6 – wydruk */}
          <Divider sx={{ my: 2 }} />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "primary.light",
              color: "primary.contrastText",
              borderRadius: 2,
              p: 1.5,
            }}
          >
            <PrintIcon sx={{ mr: 1 }} />
            <Typography variant="body1" fontWeight={600}>
              {steps.length + 1}. {t("how_it_works.final_step")}
            </Typography>
          </Box>
        </Box>

        {/* YouTube video */}
        {/*
        <Box
          sx={{
            width: "100%",
            maxWidth: 800,
            aspectRatio: "16 / 9",
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            mt: 3,
          }}
        >
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/TWOJE_VIDEO_ID"
            title={t("how_it_works.video_title")}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Box>
        */}
      </Box>
    </ThemeProvider>
  );
};

export default HowItWorksPage;
