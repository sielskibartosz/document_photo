export const DPI = 300;

// "35/45" -> { widthMm: 35, heightMm: 45 }; null dla niepełnych/niepoprawnych wartości
export function parseSizeMm(value) {
  if (typeof value !== "string" || !/^\d+\/\d+$/.test(value)) return null;
  const [widthMm, heightMm] = value.split("/").map(Number);
  if (!(widthMm > 0) || !(heightMm > 0)) return null;
  return { widthMm, heightMm };
}

export function parseAspectRatio(value) {
  const size = parseSizeMm(value);
  return size ? size.widthMm / size.heightMm : null;
}

export function cmToPx(cm, dpi = 300) {
  return Math.round((cm / 2.54) * dpi);
}

export async function getCroppedImg(imageSrc, crop, width, height) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    width,
    height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error("Nie udało się przyciąć zdjęcia"));
      resolve(URL.createObjectURL(blob));
    }, "image/png");
  });
}

export function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = (error) => reject(error);
    image.src = url;
  });
}
