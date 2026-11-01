// Wersje językowe stron w adresach (/en/..., /uk/...) - definicje w constants/seoPages.json:
// strony o tym samym "group" to ta sama treść w różnych językach ("lang", domyślnie "pl").
import SEO_PAGES from "../constants/seoPages.json";

// prefiks w adresie (ISO 639-1) -> klucz tłumaczeń w aplikacji (ukraiński to w aplikacji "ua")
const URL_PREFIX_TO_APP_LANG = { en: "en", uk: "ua" };

export function appLangFromPath(pathname) {
  return URL_PREFIX_TO_APP_LANG[pathname.split("/")[1]] || null;
}

// "/en" i "/en/" to ta sama strona - w seoPages.json klucz ma ukośnik na końcu
export function seoRoute(pathname) {
  if (SEO_PAGES[pathname]) return pathname;
  if (SEO_PAGES[pathname + "/"]) return pathname + "/";
  return null;
}

// adres tej samej strony w danym języku aplikacji albo null, jeśli takiej wersji nie ma
export function localizedPath(pathname, appLang) {
  const route = seoRoute(pathname);
  const group = route && SEO_PAGES[route].group;
  if (!group) return null;
  const urlLang = appLang === "ua" ? "uk" : appLang;
  const match = Object.entries(SEO_PAGES).find(
    ([, page]) => page.group === group && (page.lang || "pl") === urlLang
  );
  return match ? match[0] : null;
}
