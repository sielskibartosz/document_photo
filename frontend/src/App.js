import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { darkTheme } from "./styles/theme";
import AppHeader from "./components/AppHeader";
import CookiesBanner from "./components/CookiesBanner";

import HomePage from "./pages/HomePage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import IdRequirementsPage from "./pages/IdRequirementsPage";
import DownloadSuccessPage from "./pages/DownloadSuccessPage";

function App() {
  const { i18n } = useTranslation();

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <AppHeader i18n={i18n} />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/id-requirements" element={<IdRequirementsPage />} />
          <Route path="/download-success" element={<DownloadSuccessPage />} />
        </Routes>

        <CookiesBanner />
      </Router>
    </ThemeProvider>
  );
}

export default App;
