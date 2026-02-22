import React, { useState, useEffect } from "react";
import { grey } from "@mui/material/colors";
import axios from "axios";
import { BACKEND_URL } from "../constants/backendConfig";
import { useTranslation } from "react-i18next";

const FeedbackForm = ({ onClose }) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  const closeForm = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const res = await axios.post(`${BACKEND_URL}/api/feedback/`, { message });
      if (res.data.status === "ok") {
        setStatus(t("feedback.thanks"));
        setMessage("");
        setTimeout(() => closeForm(), 1500);
      } else {
        setStatus(t("feedback.error"));
      }
    } catch (err) {
      console.error(err);
      setStatus(t("feedback.error"));
    }
  };

  useEffect(() => {
    if (!isVisible && onClose) {
      onClose();
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "relative",
        padding: "10px", // Zmniejszony padding z 20px
        maxWidth: "400px",
        margin: "auto",
        borderRadius: "10px",
        backgroundColor: grey[800],
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#fff",
        minHeight: "260px",
        height: "auto",
        boxSizing: "border-box",
      }}
    >
      <h3
        style={{
          fontSize: "16px",
          margin: "1px 0 1px 0", // Zmniejszone marginesy
          fontWeight: "bold",
          textAlign: "justify",
          width: "100%",
          color: "primary.main", // Niebieski kolor jak primary.main
        }}
      >
        {t("feedback.header")}
      </h3>

      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            height: "20px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            opacity: status ? 1 : 0,
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            transition: "opacity 0.3s ease",
            marginBottom: "3px", // Zmniejszony margines
          }}
        >
          {status}
        </div>

        <textarea
          placeholder="..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          maxLength={500}
          style={{
            width: "100%",
            padding: "8px", // Zmniejszony padding z 10px
            borderRadius: "5px",
            border: `1px solid ${grey[800]}`,
            boxSizing: "border-box",
            resize: "none",
            height: "95px", // Zmniejszona wysokość textarea
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            lineHeight: "1.4",
            overflow: "hidden",
            flex: "1 0 auto",
          }}
        />

        <button
          type="submit"
          disabled={!message.trim()}
          style={{
            marginTop: "1px",
            marginBottom: "8px", // 🔹 tu dodana minimalna przerwa
            padding: "8px 16px",
            borderRadius: "5px",
            cursor: "pointer",
            width: "100%",
            backgroundColor: grey[600],
            color: "#fff",
            border: "none",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          {t("feedback.send_btn")}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
