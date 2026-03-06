import { CssBaseline, ThemeProvider } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

import { darkTheme } from "./styles/theme";
import AppHeader from "./components/AppHeader";
import CookiesBanner from "./components/CookiesBanner";

import HomePage from "./pages/HomePage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import IdRequirementsPage from "./pages/IdRequirementsPage";
import DownloadSuccessPage from "./pages/DownloadSuccessPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import FeedbackViewPage from "./pages/FeedbackViewPage";
import FotoTipsPage from "./pages/FotoTipsPage";
import { SheetProvider } from "./context/SheetContext";

import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";

function ScrollAndTrack() {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag("event", "page_view", {
        page_path: `${location.pathname}${location.search || ""}`,
      });
    }
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function App() {
  const { i18n } = useTranslation();

  return (
    <SheetProvider>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Router>
          <AppHeader i18n={i18n} />
          <ScrollAndTrack />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/id-requirements" element={<IdRequirementsPage />} />
            <Route path="/download-success" element={<DownloadSuccessPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/feedback/view/:key" element={<FeedbackViewPage />} />
            <Route path="/foto-tips" element={<FotoTipsPage />} />
          </Routes>

          <CookiesBanner />
        </Router>
      </ThemeProvider>
    </SheetProvider>
  );
}

export default App;
