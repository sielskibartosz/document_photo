// src/constants/tabs.js
import customFoto from '../assets/custom_foto.jpg';
export const TABS = [
    { key: "id", labelKey: "id_tab", aspect: "35/45" },
    { key: "custom", labelKey: "custom_tab", aspect: "50/50" },
];

export const TAB_DESCRIPTION = {
  id: {
    title: "35/45 mm",
    description: "",
    link: "https://www.gov.pl/web/gov/zdjecie-do-dowodu-lub-paszportu",
    image: customFoto,
  },
  custom: {
    title: "",
    image: customFoto,
  },
};
