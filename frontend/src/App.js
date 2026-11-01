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
import ResidenceCardPage from "./pages/ResidenceCardPage";
import { SheetProvider } from "./context/SheetContext";
import { appLangFromPath } from "./utils/localizedRoutes";

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

function ScrollAndTrack() {
  const location = useLocation();

  useEffect(() => {
    // nie wysyłamy do GA ścieżek / parametrów z kluczami admina
    const isAdminUrl =
      location.pathname.startsWith("/feedback/view") ||
      new URLSearchParams(window.location.search).has("admin");
    if (window.gtag && !isAdminUrl) {
      window.gtag("event", "page_view", {
        page_path: `${location.pathname}${location.search || ""}`,
      });
    }
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

// Wejście na /en/... lub /uk/... (np. z Google) przełącza język aplikacji.
// Późniejszy wybór języka w nagłówku nie jest nadpisywany, dopóki adres nie zmieni języka.
function LanguageFromUrl() {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const lang = appLangFromPath(pathname);

  useEffect(() => {
    if (lang && i18n.language !== lang) i18n.changeLanguage(lang);
  }, [lang, i18n]);

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
          <LanguageFromUrl />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/id-requirements" element={<IdRequirementsPage />} />
            <Route path="/download-success" element={<DownloadSuccessPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/feedback/view/:key" element={<FeedbackViewPage />} />
            <Route path="/foto-tips" element={<FotoTipsPage />} />
            <Route path="/karta-pobytu" element={<ResidenceCardPage />} />
            <Route path="/en" element={<HomePage />} />
            <Route path="/en/residence-card" element={<ResidenceCardPage />} />
            <Route path="/uk" element={<HomePage />} />
            <Route path="/uk/karta-pobytu" element={<ResidenceCardPage />} />
          </Routes>

          <CookiesBanner />
        </Router>
      </ThemeProvider>
    </SheetProvider>
  );
}

export default App;
