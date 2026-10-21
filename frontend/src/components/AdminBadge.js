import React, { useEffect, useState } from "react";
import { Chip } from "@mui/material";
import { BACKEND_URL } from "../constants/backendConfig";
import { getAdminToken } from "../utils/adminToken";

// Widoczny tylko z kodem admina - pokazuje, czy serwer uznał kod (pobieranie bez płatności)
export default function AdminBadge() {
  const [status, setStatus] = useState(null); // null | "free" | "invalid"

  useEffect(() => {
    const token = getAdminToken();
    if (!token) return;

    fetch(`${BACKEND_URL}/api/download/admin-check`, { headers: { "X-Admin-Token": token } })
      .then((resp) => (resp.ok ? resp.json() : { admin: false }))
      .then((data) => setStatus(data.admin ? "free" : "invalid"))
      .catch(() => setStatus("invalid"));
  }, []);

  if (!status) return null;

  return status === "free" ? (
    <Chip label="FREE · tryb admina" color="success" size="small" sx={{ fontWeight: 700, mr: "auto" }} />
  ) : (
    <Chip label="Nieprawidłowy kod admina" color="error" size="small" sx={{ fontWeight: 700, mr: "auto" }} />
  );
}
