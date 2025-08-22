import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEN from "./locales/en/translation.json";
import translationPL from "./locales/pl/translation.json";
import translationDE from "./locales/de/translation.json";

const resources = {
  en: { translation: translationEN },
  pl: { translation: translationPL },
  de: { translation: translationDE },
};

i18n
  .use(initReactI18next) // integracja z React
  .use(LanguageDetector)  // opcjonalnie: wykrywanie języka przeglądarki
  .init({
    resources,
    lng: "pl",            // <-- domyślny język
    fallbackLng: "pl",     // jeśli tłumaczenie nie istnieje
    interpolation: { escapeValue: false },
  });

export default i18n;
