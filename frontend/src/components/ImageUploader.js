import React from "react";

function ImageUploader({ onChange }) {
  return (
    <div>
      <label>
        Wybierz zdjęcie:{" "}
        <input type="file" accept="image/*" onChange={onChange} />
      </label>
    </div>
  );
}

export default ImageUploader;
