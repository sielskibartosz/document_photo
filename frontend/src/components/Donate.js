// components/Donate.js
import React from "react";
import { Button } from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
import { useTranslation } from "react-i18next";

// 🔑 Twój PUBLIC_KEY z Stripe
const stripePromise = loadStripe("pk_test_TWÓJ_PUBLIC_KEY");

export default function Donate() {
  const { t } = useTranslation(); // pobieramy tłumaczenia

  const handleDonate = async () => {
    const res = await fetch("http://localhost:8000/create-checkout-session", {
      method: "POST",
    });
    const { id } = await res.json();

    const stripe = await stripePromise;
    await stripe.redirectToCheckout({ sessionId: id });
  };

  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={handleDonate}
      sx={{
        ml: 2,
        backgroundColor: "#c28c5c",
        "&:hover": { backgroundColor: "#d97706" },
        fontSize: "0.875rem"
      }}
    >
      {t("donate")} {/* tłumaczenie */}
    </Button>
  );
}
