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
      const res = await axios.post(`${BACKEND_URL}/api/feedback`, { message });
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
        padding: "20px",
        maxWidth: "400px",
        margin: "auto",
        borderRadius: "10px",
        backgroundColor: grey[800],
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#fff", // pasuje do darkTheme
      }}
    >
      {/* X do zamykania */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          closeForm();
        }}
        style={{
          position: "absolute",
          top: "10px",
          right: "15px",
          background: "none",
          border: "none",
          color: "#fff",
          fontSize: "24px",
          fontWeight: "bold",
          cursor: "pointer",
          width: "30px",
          height: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "rgba(255,255,255,0.2)")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
      >
        ×
      </button>

      <h3
          style={{
            fontSize: "16px", // mniejszy rozmiar
            margin: "10px 0",
            fontWeight: "bold",
            textAlign: "center", // wyśrodkowanie
            width: "100%", // żeby textAlign działało
          }}
        >
          {t("feedback.header")}
        </h3>

      <form onSubmit={handleSubmit} style={{ width: "100%", flex: 1 }}>
        <textarea
          placeholder=""
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          maxLength={500}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            border: `1px solid ${grey[600]}`,
            boxSizing: "border-box",
            resize: "none",
            height: "120px",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        />
        <button
          type="submit"
          disabled={!message.trim()}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
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

      {status && (
        <p
          style={{
            marginTop: "5px",
            fontSize: "14px",
            textAlign: "center",
            opacity: 0.9,
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          {status}
        </p>
      )}
    </div>
  );
};

export default FeedbackForm;
