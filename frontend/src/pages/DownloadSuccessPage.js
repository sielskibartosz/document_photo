import { useEffect } from "react";
import { Box, Button, Typography, ThemeProvider, CssBaseline, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { darkTheme } from "../styles/theme";

const DownloadSuccessPage = () => {
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    const dataUrl = sessionStorage.getItem("sheetBlob");
    if (!dataUrl) return;

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "sheet.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // można usunąć z sessionStorage po pobraniu
    sessionStorage.removeItem("sheetBlob");
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
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Your sheet download should start automatically. If it doesn’t, you can{" "}
          <Button
            variant="text"
            onClick={() => {
              const dataUrl = sessionStorage.getItem("sheetBlob");
              if (!dataUrl) return;
              const link = document.createElement("a");
              link.href = dataUrl;
              link.download = "sheet.jpg";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            download manually
          </Button>
          .
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
