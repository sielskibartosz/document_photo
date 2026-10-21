// Kod admina z ?admin=... zapamiętujemy w karcie przeglądarki, żeby nie znikał
// po przejściu na inną podstronę (linki wewnętrzne gubią parametry z adresu).
const STORAGE_KEY = "adminToken";

export const getAdminToken = () => {
  const fromUrl = new URLSearchParams(window.location.search).get("admin");
  try {
    if (fromUrl) sessionStorage.setItem(STORAGE_KEY, fromUrl);
    return fromUrl || sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return fromUrl;
  }
};
