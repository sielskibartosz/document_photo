import React, { useState, useEffect } from "react";

const CookiesBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookiesAccepted");
    if (!accepted) setVisible(true);
  }, []);

  const loadGoogleScripts = () => {
    // Google Ads
    const ads = document.createElement("script");
    ads.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6051632799523144";
    ads.async = true;
    ads.crossOrigin = "anonymous";
    document.body.appendChild(ads);

    // Google Analytics
    const ga = document.createElement("script");
    ga.src = "https://www.googletagmanager.com/gtag/js?id=G-4GGMXV1R1V";
    ga.async = true;
    document.head.appendChild(ga);

    const inlineGA = document.createElement("script");
    inlineGA.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-4GGMXV1R1V', {
        'cookie_flags': 'SameSite=None;Secure',
        'allow_ad_personalization_signals': false
      });

      // Globalna funkcja do pobierania GA client_id
      window.getGAClientId = function() {
        // Metoda 1: Z cookie _ga
        const gaCookie = document.cookie.match(/(_ga_[A-Z0-9]+)=([^;]+)/);
        if (gaCookie) {
          const parts = gaCookie[2].split('.');
          return parts.slice(-2).join('.');
        }
        // Metoda 2: Z gtag API (asynchronicznie)
        return new Promise((resolve) => {
          gtag('get', 'G-4GGMXV1R1V', 'client_id', (clientId) => {
            resolve(clientId);
          });
        });
      };

      // Event po załadowaniu GA (opcjonalnie)
      gtag('event', 'cookies_accepted', {
        event_category: 'user_consent',
        event_label: 'cookies_banner'
      });
    `;
    document.head.appendChild(inlineGA);
  };

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setVisible(false);
    loadGoogleScripts();
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        backgroundColor: "#222",
        color: "white",
        padding: "12px 20px",
        textAlign: "center",
        zIndex: 1000,
      }}
    >
      <p style={{ margin: 0 }}>
        Ta strona korzysta z plików cookies, aby poprawić jakość usług.{" "}
        <a
          href="/#/privacy-policy"
          style={{ color: "#00bcd4", textDecoration: "underline" }}
        >
          Dowiedz się więcej
        </a>
      </p>
      <button
        onClick={acceptCookies}
        style={{
          marginTop: "8px",
          padding: "6px 12px",
          backgroundColor: "#00bcd4",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        autoFocus
      >
        Akceptuję
      </button>
    </div>
  );
};

export default CookiesBanner;
