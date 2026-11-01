export const STRIPE_PRICE_ID_DEV = "price_1S1WQXC6i4TNfy0rDJQFSeSC";
export const STRIPE_PRICE_ID_PROD_PLN = "price_1UT5ceC6i4TNfy0rVPFYnVuZ";
export const STRIPE_PRICE_ID_PROD_EUR = "price_1T1vPyC6i4TNfy0rfML1cFZx";

// Waluta zależy od kraju, nie od języka - np. Ukrainiec mieszkający w Polsce płaci w PLN.
// Kraj rozpoznajemy po strefie czasowej przeglądarki; polski interfejs też oznacza PLN.
export function isPolishCustomer(lang) {
  if (lang === "pl") return true;
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone === "Europe/Warsaw";
  } catch (e) {
    return false;
  }
}