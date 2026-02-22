const apiFetch = async (url, options = {}) => {
  // Skopiuj opcje i nagłówki
  const opts = { ...options, headers: { ...(options.headers || {}) } };

  // 🔥 Pobierz parametr ?admin z URL i wyślij jako nagłówek
  const urlParams = new URLSearchParams(window.location.search);
  const adminParam = urlParams.get('admin');
  if (adminParam) {
    opts.headers["X-Admin-Token"] = adminParam;
    console.log("💎 X-Admin-Token added to request");
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