import { getAdminToken } from "./adminToken";

const apiFetch = async (url, options = {}) => {
  // Skopiuj opcje i nagłówki
  const opts = { ...options, headers: { ...(options.headers || {}) } };

  // 🔥 Kod admina (z ?admin= lub zapamiętany w karcie) wysyłamy jako nagłówek
  const adminParam = getAdminToken();
  if (adminParam) {
    opts.headers["X-Admin-Token"] = adminParam;
  }

  try {
    const response = await fetch(url, opts);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    return response;
  } catch (error) {
    console.error('❌ apiFetch error:', error);
    throw error;
  }
};

export default apiFetch;