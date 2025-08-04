export const DPI = 300;

export function parseAspectRatio(value) {
  const parts = value.split("/").map(Number);
  if (parts.length !== 2 || parts.some(isNaN)) return null;
  return parts[0] / parts[1];
}

export function cmToPx(cm) {
  return (cm / 2.54) * DPI;
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

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
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
