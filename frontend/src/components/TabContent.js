import React from "react";

const aspectPlaceholders = {
  custom: "np. 40/60",
};

const tabDescriptions = {
  id: {
    text: "Zdjęcie do dowodu osobistego — wymiary 35x45 mm.",
    image: "/images/ID_correct_foto.png",
  },
  license: {
    text: "Zdjęcie do prawa jazdy — wymiary 35x45 mm.",
    image: "/images/ID_correct_foto.png",
  },
  visa: {
    text: "Zdjęcie do wizy — wymiary 50x50 mm (USA, Indie itp.).",
    image: "/images/ID_correct_foto.png",
  },
  custom: {
    text: "Wprowadź własne proporcje zdjęcia, np. 40/60 mm.",
  },
};

const TabContent = ({ tabKey, aspectInput, setAspectInput }) => {
  const { text, image } = tabDescriptions[tabKey] || {};

  return (
    <div style={{ marginBottom: 24, textAlign: "center" }}>
      {image && (
        <img
          src={image}
          alt={`Przykład zdjęcia - ${tabKey}`}
          style={{ maxWidth: 200, marginBottom: 12, borderRadius: 8 }}
        />
      )}
      {text && (
        <div style={{ marginBottom: 12, fontSize: 15, color: "#333" }}>
          {text}
        </div>
      )}

      {tabKey === "custom" && (
        <>
          <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
            Wymiary zdjęcia (mm):
          </label>
          <input
            type="text"
            value={aspectInput}
            onChange={(e) => setAspectInput(e.target.value)}
            placeholder={aspectPlaceholders[tabKey]}
            style={{
              padding: "10px 16px",
              fontSize: 16,
              borderRadius: 6,
              border: "1.5px solid #bdc3c7",
              width: "200px",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#3498db")}
            onBlur={(e) => (e.target.style.borderColor = "#bdc3c7")}
          />
        </>
      )}
    </div>
  );
};

export default TabContent;
