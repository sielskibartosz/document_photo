// src/tabs.js

export const TABS = [
    {key: "id", label: "Dowód osobisty/Prawo jazdy", aspect: "35/45"},
    {key: "custom", label: "Inne", aspect: "50/60"},
];

export const TAB_DESCTIPTION = {
  id: {
    title: "Zdjęcie 35x45 mm",
    description: "",
    link: "https://www.gov.pl/web/gov/zdjecie-do-dowodu-lub-paszportu",
    image: "/images/ID_correct_foto.png",
  },
  custom: {
    title: "Wymiary zdjęcia, np. 50/60 mm.",
    image: "/images/custom_foto.jpg",
  },
};