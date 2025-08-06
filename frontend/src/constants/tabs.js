// src/tabs.js

export const TABS = [
  { key: "id", label: "Dowód osobisty/Prawo jazdy", aspect: "35/45" },
  { key: "custom", label: "Inne", aspect: "50/60" },
];

export const TAB_DESCTIPTION = {
  id: {
    text: "Zdjęcie do dowodu osobistego — wymiary 35x45 mm.",
    image: "/images/ID_correct_foto.png",
  },
  custom: {
    text: "Wymiary zdjęcia, np. 50/60 mm.",
    image: "/images/dyplom.jpg",
  },
};