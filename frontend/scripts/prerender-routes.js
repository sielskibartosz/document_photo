// Uruchamiany po "react-scripts build".
// GitHub Pages nie zna ścieżek Reacta - dla każdej podstrony zapisujemy osobny plik HTML
// (np. build/how-it-works.html, serwowany pod /how-it-works) z jej tytułem, opisem, canonical
// i treścią widoczną dla Google bez JavaScriptu. React po starcie zastępuje tę treść aplikacją.
// build/404.html łapie pozostałe ścieżki (np. /feedback/view/...), żeby aplikacja i tak wystartowała.
// Wersje językowe (/en/, /uk/...) to strony z polem "lang"; strony z tym samym "group" dostają
// wzajemne linki hreflang, a polska wersja jest x-default.
const fs = require("fs");
const path = require("path");

const SITE = "https://photoidcreator.com";
const BUILD = path.join(__dirname, "..", "build");
const PAGES = require("../src/constants/seoPages.json");

const NAV = {
  pl: [
    ["/", "Zdjęcie do dowodu online"],
    ["/id-requirements", "Wymagania zdjęcia do dowodu"],
    ["/karta-pobytu", "Zdjęcie do karty pobytu"],
    ["/how-it-works", "Jak to działa"],
    ["/foto-tips", "Jak zrobić zdjęcie telefonem"],
    ["/privacy-policy", "Polityka prywatności"],
    ["/en/", "English"],
    ["/uk/", "Українська"],
  ],
  en: [
    ["/en/", "Passport and ID photo online"],
    ["/en/residence-card", "Residence card photo"],
    ["/", "Polski"],
    ["/uk/", "Українська"],
  ],
  uk: [
    ["/uk/", "Фото на документи онлайн"],
    ["/uk/karta-pobytu", "Фото на карту побиту"],
    ["/", "Polski"],
    ["/en/", "English"],
  ],
};

const OG_LOCALE = { pl: "pl_PL", en: "en_US", uk: "uk_UA" };

const escapeHtml = (text) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function replaceOnce(html, pattern, replacement, label) {
  if (!pattern.test(html)) throw new Error(`prerender: nie znaleziono ${label} w build/index.html`);
  return html.replace(pattern, replacement);
}

function setMeta(html, attr, key, value) {
  const pattern = new RegExp(`<meta ${attr}="${key}" content="[^"]*"\\s*/?>`);
  return replaceOnce(html, pattern, `<meta ${attr}="${key}" content="${escapeHtml(value)}"/>`, `meta ${key}`);
}

function renderContent(page, lang) {
  if (!page.h1) return "";
  const parts = [`<h1>${escapeHtml(page.h1)}</h1>`];
  for (const p of page.paragraphs || []) parts.push(`<p>${escapeHtml(p)}</p>`);
  if (page.list) parts.push(`<ul>${page.list.map((li) => `<li>${escapeHtml(li)}</li>`).join("")}</ul>`);
  parts.push(`<nav><ul>${NAV[lang].map(([href, label]) => `<li><a href="${href}">${escapeHtml(label)}</a></li>`).join("")}</ul></nav>`);
  return `<main style="max-width:720px;margin:0 auto;padding:24px 16px;font-family:sans-serif">${parts.join("")}</main>`;
}

// linki hreflang do wszystkich wersji językowych tej samej strony
function alternateLinks(page) {
  if (!page.group) return "";
  const versions = Object.entries(PAGES).filter(([, p]) => p.group === page.group);
  const links = versions.map(
    ([route, p]) => `<link rel="alternate" hreflang="${p.lang || "pl"}" href="${SITE + route}"/>`
  );
  const polish = versions.find(([, p]) => !p.lang);
  if (polish) links.push(`<link rel="alternate" hreflang="x-default" href="${SITE + polish[0]}"/>`);
  return links.join("");
}

function renderPage(template, route, page) {
  const url = SITE + route;
  const lang = page.lang || "pl";
  let html = template;
  html = replaceOnce(html, /<html lang="[^"]*"/, `<html lang="${lang}"`, "<html lang>");
  html = setMeta(html, "property", "og:locale", OG_LOCALE[lang]);
  html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${escapeHtml(page.title)}</title>`, "title");
  html = setMeta(html, "name", "description", page.description);
  html = setMeta(html, "property", "og:url", url);
  html = setMeta(html, "property", "og:title", page.title);
  html = setMeta(html, "property", "og:description", page.description);
  html = setMeta(html, "name", "twitter:url", url);
  html = setMeta(html, "name", "twitter:title", page.title);
  html = setMeta(html, "name", "twitter:description", page.description);

  const headExtra = page.noindex
    ? `<meta name="robots" content="noindex"/>`
    : `<link rel="canonical" href="${url}"/>${alternateLinks(page)}`;
  html = replaceOnce(html, /<\/head>/, `${headExtra}</head>`, "</head>");
  html = replaceOnce(html, /<div id="root"><\/div>/, `<div id="root">${renderContent(page, lang)}</div>`, "#root");
  return html;
}

const template = fs.readFileSync(path.join(BUILD, "index.html"), "utf8");

for (const [route, page] of Object.entries(PAGES)) {
  // "/en/" -> en/index.html (GitHub Pages serwuje katalog), "/en/residence-card" -> en/residence-card.html
  const file = route.endsWith("/") ? `${route.slice(1)}index.html` : `${route.slice(1)}.html`;
  fs.mkdirSync(path.dirname(path.join(BUILD, file)), { recursive: true });
  fs.writeFileSync(path.join(BUILD, file), renderPage(template, route, page));
  console.log(`prerender: ${route} -> build/${file}`);
}

// zapasowa strona dla ścieżek bez własnego pliku - startuje aplikację, ale nie jest indeksowana
fs.writeFileSync(
  path.join(BUILD, "404.html"),
  renderPage(template, "/", { ...PAGES["/"], h1: null, noindex: true })
);
console.log("prerender: build/404.html");
