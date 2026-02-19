const apiFetch = async (url, options = {}) => {
  const opts = { ...options, headers: { ...(options.headers || {}) } };

  // CRA: REACT_APP_ prefix!
  const adminToken = process.env.REACT_APP_ADMIN_TOKEN;

  console.log('🔍 REACT_APP_ADMIN_TOKEN:', adminToken ? 'OK' : 'MISSING');

  if (window.location.hostname === "localhost" && adminToken) {
    opts.headers["X-Admin-Token"] = adminToken;
  }

  const response = await fetch(url, opts);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response;
};

export default apiFetch;
