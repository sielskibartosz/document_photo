import { appLangFromPath, localizedPath, seoRoute } from "./localizedRoutes";

test("język aplikacji z prefiksu adresu", () => {
  expect(appLangFromPath("/uk/karta-pobytu")).toBe("ua");
  expect(appLangFromPath("/en")).toBe("en");
  expect(appLangFromPath("/karta-pobytu")).toBeNull();
  expect(appLangFromPath("/")).toBeNull();
});

test("adres z ukośnikiem i bez to ta sama strona", () => {
  expect(seoRoute("/en")).toBe("/en/");
  expect(seoRoute("/en/")).toBe("/en/");
  expect(seoRoute("/feedback/view/abc")).toBeNull();
});

test("odpowiednik strony w innym języku", () => {
  expect(localizedPath("/uk/karta-pobytu", "pl")).toBe("/karta-pobytu");
  expect(localizedPath("/karta-pobytu", "en")).toBe("/en/residence-card");
  expect(localizedPath("/", "ua")).toBe("/uk/");
  expect(localizedPath("/en", "pl")).toBe("/");
  // brak wersji niemieckiej i strony bez wersji językowych - zostajemy na miejscu
  expect(localizedPath("/uk/", "de")).toBeNull();
  expect(localizedPath("/how-it-works", "en")).toBeNull();
});
