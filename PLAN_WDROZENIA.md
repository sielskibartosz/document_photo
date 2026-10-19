# Plan testów i wdrożenia – gałąź `fix/review-bugs`

Co wchodzi: poprawki z przeglądu kodu (płatności, pobieranie, kadrowanie, bezpieczeństwo)
oraz strojenie usuwania tła (4 wątki, kadr 2× większy). Szczegóły: `git log master..fix/review-bugs`.
Instrukcja deployu: `README.md`, sekcja 4.

---

## 1. Do przygotowania przed testami

### Dostępy
- [ ] Hasło do klucza SSH (`~/.ssh/id_ed25519`) – logowanie na `root@46.225.109.176`.
- [ ] Dostęp do Stripe Dashboard (tryb test i live).
- [ ] Dostęp do GitHuba (push na `master`, GitHub Pages).

### Stripe
- [ ] Klucz testowy `sk_test_...` do `backend/.env` lokalnie.
- [ ] Stripe CLI zainstalowane (`stripe login`) – do webhooka lokalnie.
- [ ] W webhooku produkcyjnym (`https://api.photoidcreator.com/api/payments/webhook`) dodać zdarzenie
      **`checkout.session.async_payment_succeeded`** (obok `checkout.session.completed`).
- [ ] Sprawdzić, czy ceny w Stripe zgadzają się z `frontend/src/constants/payments.js`
      (PLN: `price_1T1vNZ...`, EUR: `price_1T1vPy...`, test: `price_1S1WQX...`).

### Konfiguracja
- [ ] Lokalny `backend/.env`: `ALLOWED_ORIGIN=http://localhost:3000`, klucze testowe Stripe, `ADMIN_DOWNLOAD_KEY` (niepusty).
- [ ] Na serwerze sprawdzić `/document_photo/backend/.env`:
  - `ALLOWED_ORIGIN=https://photoidcreator.com,https://www.photoidcreator.com` (bez cudzysłowów),
  - `FEEDBACK_FILE` = `data/feedback.txt` albo brak tej linii,
  - `ADMIN_DOWNLOAD_KEY` ustawiony (pusty = tryb admina wyłączony).

### Materiały do testów
- [ ] Zdjęcia testowe – `Desktop\fotos` (różne włosy, okulary, tło).
- [ ] Karta testowa Stripe: `4242 4242 4242 4242`, dowolna przyszła data, dowolny CVC.
- [ ] Telefon z iOS i z Androidem (pobieranie pliku na telefonie).

---

## 2. Testy lokalne (przed deployem)

Uruchomienie: backend `uvicorn app.main:app --reload --port 8080`, frontend `npm start`,
webhook `stripe listen --forward-to localhost:8080/api/payments/webhook`.

### Kadrowanie i tło
- [ ] Zakładka „Dowód”: wgranie zdjęcia → „Przytnij i zmień tło” → zdjęcie trafia na arkusz.
- [ ] Jakość krawędzi włosów (kadr jest teraz 2× większy) – porównać z produkcją.
- [ ] Czas usuwania tła (oczekiwane ~20 s lokalnie).
- [ ] Zakładka „Własny rozmiar”: wpisanie np. `50/50` → na arkuszu zdjęcie ma 50×50 mm (nie 35 mm szerokości).
- [ ] Wpisywanie niepełnego rozmiaru (`50/`, `0/0`) – cropper się nie psuje, przyciski są wyłączone.
- [ ] Usunięcie zdjęcia (kosz) w trakcie usuwania tła – stare zdjęcie **nie** trafia na arkusz.
- [ ] Wgranie nowego zdjęcia w trakcie usuwania tła – nowe zdjęcie nie znika.
- [ ] „Dodaj z tłem” (zakładka własna).

### Arkusz
- [ ] Zmiana formatu papieru (10x15, A4…) – poprawna liczba zdjęć i układ.
- [ ] Duplikowanie zdjęcia, czyszczenie arkusza.
- [ ] Szybka zmiana formatu kilka razy pod rząd – podgląd zgodny z ostatnio wybranym.

### Płatność i pobieranie
- [ ] „Pobierz arkusz” → przekierowanie do Stripe (test) → płatność kartą testową → powrót na stronę sukcesu.
- [ ] Na stronie sukcesu „Pobierz” – plik `photo_sheet.jpg` się pobiera, otwiera się jako JPEG.
- [ ] Kliknięcie „Pobierz” zaraz po powrocie (przed webhookiem) – komunikat „Czekamy na potwierdzenie płatności…”, potem pobranie.
- [ ] Ten sam link do płatności użyty drugi raz – Stripe nie pozwala zapłacić ponownie (link jednorazowy).
- [ ] Tryb admina: `?admin=<ADMIN_DOWNLOAD_KEY>` – pobranie bez płatności.
- [ ] Restart backendu między płatnością a pobraniem – plik nadal da się pobrać (tokeny na dysku).
- [ ] Z włączonym adblockiem – przycisk „Pobierz arkusz” nie zawiesza się.

### Bezpieczeństwo (szybko, np. curl / Postman)
- [ ] Pusty nagłówek `X-Admin-Token:` → pobranie nieopłaconego pliku daje **403**.
- [ ] `create-link` z innym `price_id` → **400**.
- [ ] `create-link` z `redirect_url` na obcą domenę → **400**.

### Inne
- [ ] Zmiana języka (PL/EN/DE/ES/FR/UA) – brak „surowych” kluczy i polskich tekstów w innych językach.
- [ ] Baner cookies: przed akceptacją GA nie ustawia ciasteczek `_ga` (DevTools → Application → Cookies).
- [ ] Formularz opinii + podgląd `/#/feedback/view/<ADMIN_KEY>`.

---

## 3. Wdrożenie

1. [ ] Scalić gałąź i wypchnąć: `git checkout master && git merge fix/review-bugs && git push`.
2. [ ] Stripe: dodać zdarzenie `checkout.session.async_payment_succeeded` do webhooka (jeśli nie zrobione).
3. [ ] Serwer – jednorazowe poprawki z README (sekcja 4 → „Jednorazowe poprawki serwera”):
   - [ ] **najpierw** skopiować `feedback.txt` ze starego kontenera do `/data`,
   - [ ] swap 4 GB,
   - [ ] `.env` (`ALLOWED_ORIGIN`, `FEEDBACK_FILE`),
   - [ ] nginx: `client_max_body_size 30M;` i `proxy_read_timeout 120s;`.
4. [ ] Backend: `docker tag … :prev`, `git pull`, build, nowy `docker run` (z `--restart unless-stopped`, port na 127.0.0.1).
5. [ ] Sprawdzić: `curl https://api.photoidcreator.com/ping` i `curl -m 5 http://46.225.109.176:8080/ping`
       (to drugie **nie** powinno już odpowiadać).
6. [ ] Frontend: `cd frontend && npm run deploy`.
7. [ ] Dopiero teraz: `apt upgrade` + `reboot` serwera, po restarcie `docker ps` i `/ping`.

## 4. Testy po wdrożeniu (produkcja)

- [ ] Strona się ładuje, w konsoli przeglądarki brak błędów (m.in. brak 404 na `main.*.js`).
- [ ] Usunięcie tła na produkcji – czas (oczekiwane ~20–30 s).
- [ ] Pełny zakup (prawdziwa płatność minimalnej kwoty albo tryb admina) i pobranie – na komputerze, iOS i Androidzie.
- [ ] Stripe Dashboard → Webhooks: zdarzenie dostarczone z odpowiedzią 200.
- [ ] `docker logs backend_app_1` – brak błędów; `free -h` – zużycie RAM w trakcie usuwania tła.
- [ ] Podgląd opinii działa i zawiera stare opinie.

## 5. Gdy coś pójdzie nie tak

- Backend: wrócić do `backend-app:prev` (README → „Wycofanie wersji”).
- Frontend: `git checkout <poprzedni commit>` w `frontend/` i `npm run deploy`, albo `git revert` i deploy.
- Płatności nie przechodzą („Nieprawidłowy adres przekierowania”) → sprawdzić `ALLOWED_ORIGIN` w `.env` na serwerze.
