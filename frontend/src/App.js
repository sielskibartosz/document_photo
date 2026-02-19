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

import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// Wrapper do śledzenia page_view dla HashRouter
function ScrollAndTrack() {
  const location = useLocation();

  useEffect(() => {
    // GA4 Page View
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: location.hash || '/'
      });
    }
    // Scroll do góry przy zmianie strony
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function App() {
  const { i18n } = useTranslation();

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        {/* Header */}
        <AppHeader i18n={i18n} />

        {/* Page View Tracking */}
        <ScrollAndTrack />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/id-requirements" element={<IdRequirementsPage />} />
          <Route path="/download-success" element={<DownloadSuccessPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/feedback/view/:key" element={<FeedbackViewPage />} />
        </Routes>

        {/* Cookies */}
        <CookiesBanner />
      </Router>
    </ThemeProvider>
  );
}

export default App;
