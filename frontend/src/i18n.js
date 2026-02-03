import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEN from "./locales/en/translation.json";
import translationPL from "./locales/pl/translation.json";
import translationDE from "./locales/de/translation.json";
import translationES from "./locales/es/translation.json";

const resources = {
  en: { translation: translationEN },
  pl: { translation: translationPL },
  de: { translation: translationDE },
  es: { translation: translationES },
};

// --- funkcja wykrywająca język na start
function detectInitialLanguage() {
  // 1️⃣ najpierw sprawdź, czy użytkownik wybrał język wcześniej
  const savedLang = localStorage.getItem("i18nextLng");
  if (savedLang) return savedLang;

  // 2️⃣ inaczej wykryj język z przeglądarki
  const browserLang = navigator.language || navigator.userLanguage; // np. "pl-PL"
  const shortLang = browserLang.split("-")[0]; // "pl", "de", "en", "es"

  // 3️⃣ jeśli obsługiwany → użyj, jeśli nie → fallback
  if (["pl", "de", "en", "es"].includes(shortLang)) return shortLang;

  return "pl"; // domyślnie polski
}

i18n
  .use(initReactI18next)    // integracja z React
  .use(LanguageDetector)    // wykrywanie języka przeglądarki
  .init({
    resources,
    lng: detectInitialLanguage(),  // <-- automatyczny wybór
    fallbackLng: "pl",             // jeśli tłumaczenie nie istnieje
    interpolation: { escapeValue: false },
    detection: {
      // pozwala pamiętać wybór użytkownika w localStorage
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
