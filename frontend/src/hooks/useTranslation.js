import React from "react";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <button onClick={() => changeLanguage("pl")}>PL</button>
      <button onClick={() => changeLanguage("en")}>EN</button>
    </div>
  );
};

export default Home;
