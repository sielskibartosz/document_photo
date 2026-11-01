import { isPolishCustomer } from "./payments";

const mockTimeZone = (timeZone) =>
  jest.spyOn(Intl, "DateTimeFormat").mockImplementation(() => ({ resolvedOptions: () => ({ timeZone }) }));

afterEach(() => jest.restoreAllMocks());

test("PLN dla osób w Polsce niezależnie od języka", () => {
  mockTimeZone("Europe/Warsaw");
  expect(isPolishCustomer("ua")).toBe(true);
  expect(isPolishCustomer("en")).toBe(true);
});

test("EUR poza Polską, chyba że interfejs jest po polsku", () => {
  mockTimeZone("Europe/Kyiv");
  expect(isPolishCustomer("ua")).toBe(false);
  expect(isPolishCustomer("de")).toBe(false);
  expect(isPolishCustomer("pl")).toBe(true);
});
