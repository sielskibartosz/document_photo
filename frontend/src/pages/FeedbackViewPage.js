import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

const BACKEND_URL = "http://localhost:8000";

const FeedbackViewPage = () => {
  const { key } = useParams();
  const [feedbacks, setFeedbacks] = useState([]);
  const [status, setStatus] = useState("Ładowanie...");

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/feedback/view/${key}`
        );

        if (res.data.status === "ok") {
          const sorted = [...res.data.feedbacks].reverse(); // najnowsze na górze
          setFeedbacks(sorted);
          setStatus(sorted.length === 0 ? "Brak opinii." : "");
        } else {
          setFeedbacks([]);
          setStatus("Brak dostępu.");
        }
      } catch (err) {
        console.error(err);
        setFeedbacks([]);
        setStatus("Błąd połączenia z serwerem.");
      }
    };

    if (key) fetchFeedback();
    else setStatus("Brak klucza dostępu.");
  }, [key]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: 2,
        py: 6,
        backgroundColor: grey[900],
        color: grey[100],
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <Typography
        sx={{
          fontSize: 16,
          fontWeight: 600,
          mb: 3,
          letterSpacing: 0.5,
        }}
      >
        Opinie
      </Typography>

      {status && (
        <Typography
          sx={{
            fontSize: 13,
            color: grey[400],
            mb: 2,
          }}
        >
          {status}
        </Typography>
      )}

      {feedbacks.map((fb, idx) => (
        <Typography
          key={idx}
          sx={{
            fontSize: 14,
            lineHeight: 1.6,
            mb: 1.2,
            whiteSpace: "pre-wrap",
          }}
        >
          {fb.message}
          {fb.timestamp && (
            <Typography
              component="span"
              sx={{
                display: "block",
                fontSize: 11,
                color: grey[500],
                ml: 2,
              }}
            >
              {fb.timestamp}
            </Typography>
          )}
        </Typography>
      ))}
    </Box>
  );
};

export default FeedbackViewPage;
