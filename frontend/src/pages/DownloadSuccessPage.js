import { useEffect } from "react";
import { Box, Button, Typography, ThemeProvider, CssBaseline, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { darkTheme } from "../styles/theme";
import { BACKEND_URL } from "../constants/backendConfig";

const DownloadSuccessPage = () => {
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    const downloadFile = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/download-sheet`);
        if (!res.ok) throw new Error("Download failed");

        const blob = await res.blob();
        if (!blob.size) throw new Error("Empty file");

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "sheet.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Automatic download failed:", err);
      }
    };

    downloadFile();
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          p: isSmallScreen ? 2 : 4,
          width: isSmallScreen ? "95vw" : "80vw",
          margin: "10px auto",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          color: darkTheme.palette.text.primary,
          background:
            darkTheme.palette.mode === "dark"
              ? "linear-gradient(135deg, #1f2937 0%, #374151 100%)"
              : "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          borderRadius: 3,
          boxShadow: darkTheme.shadows[4],
        }}
      >
        <Typography variant={isSmallScreen ? "h5" : "h4"} gutterBottom color="text.primary">
          Thank you for your payment!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Your sheet download should start automatically.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          If it doesn’t, you can{" "}
          <a
            href={`${BACKEND_URL}/download-sheet`}
            target="_blank"
            rel="noopener noreferrer"
          >
            click here to download manually
          </a>.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
      </Box>
    </ThemeProvider>
  );
};

export default DownloadSuccessPage;
