import React, { useState, useEffect } from "react";

const CookiesBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookiesAccepted");
    if (!accepted) setVisible(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setVisible(false);
    
    // ✅ GA4 consent update (GA jest już załadowany w public/index.html)
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'ad_storage': 'granted',
        'analytics_storage': 'granted'
      });
      
      window.gtag('event', 'cookies_accepted', {
        event_category: 'user_consent',
        event_label: 'cookies_banner'
      });
    }
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
