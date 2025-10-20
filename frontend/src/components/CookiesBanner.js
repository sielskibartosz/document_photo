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
      gtag('config','G-4GGMXV1R1V');
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
          href="/privacy-policy"
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
      >
        Akceptuję
      </button>
    </div>
  );
};

export default CookiesBanner;
