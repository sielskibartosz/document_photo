# PhotoIDCreator – notatki projektu

Aplikacja do przygotowywania zdjęć do dokumentów: upload → kadrowanie → usunięcie tła (AI) →
arkusz do druku → płatność Stripe → pobranie pliku.

| Część | Technologia | Gdzie działa |
|---|---|---|
| `frontend/` | React (Create React App), MUI, i18next | GitHub Pages – `https://photoidcreator.com` |
| `backend/` | FastAPI, InSPyReNet (`transparent-background`, torch), Stripe | Hetzner VPS `46.225.109.176` (4 vCPU, 8 GB RAM, Ubuntu 24.04) – `https://api.photoidcreator.com` |

---

## 1. Uruchomienie lokalne

Wymagania: Python 3.12, Node 20, ~6 GB wolnego RAM (model usuwania tła zużywa ~5 GB).

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate            # Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt
# plik backend/.env z konfiguracją – patrz sekcja 3 (do developmentu można skopiować .env_dev)
uvicorn app.main:app --reload --port 8080
```

- API: `http://localhost:8080`, dokumentacja: `http://localhost:8080/docs`, health check: `/ping`.
- Przy pierwszym starcie model (~370 MB) pobiera się do `~/.transparent-background/`.
- Uruchamiaj z katalogu `backend/` – ścieżki `data/` i `downloads/` są względne.

### Frontend

```bash
cd frontend
npm install
npm start          # http://localhost:3000
```

W trybie `development` frontend łączy się z `http://localhost:8080`, w buildzie produkcyjnym
z `https://api.photoidcreator.com` (`src/constants/backendConfig.js`).

### Płatności lokalnie (Stripe CLI)

```bash
stripe login
stripe listen --forward-to localhost:8080/api/payments/webhook
```

`stripe listen` wypisze `whsec_...` – wpisz go jako `STRIPE_WEBHOOK_SECRET` w `backend/.env`.
Używaj kluczy testowych (`sk_test_...`) i testowej ceny (`STRIPE_PRICE_ID_DEV`).

### Tryb admina (pobranie bez płatności)

Dopisz do adresu `?admin=<ADMIN_DOWNLOAD_KEY>`, np. `http://localhost:3000/?admin=XYZ#/`.
Frontend wyśle klucz w nagłówku `X-Admin-Token`. Działa tylko, gdy `ADMIN_DOWNLOAD_KEY` jest ustawiony.

Opinie użytkowników: `/#/feedback/view/<ADMIN_KEY>`.

### Docker lokalnie

```bash
docker compose up --build     # z katalogu głównego
```

Uwaga: obraz frontendu to build produkcyjny, więc łączy się z produkcyjnym API, nie z lokalnym backendem.
Do lokalnej pracy nad frontendem używaj `npm start`.

---

## 2. Testy / sprawdzenie przed wdrożeniem

```bash
cd frontend && npm run build                       # musi się zbudować bez błędów
cd backend && python -m py_compile app/*.py app/api/*.py app/services/*.py
```

Ręcznie: wgraj zdjęcie → przytnij i usuń tło → dodaj do arkusza → pobierz (tryb admina lub płatność testowa).

---

## 3. Konfiguracja backendu (`backend/.env`)

Plik `.env` **nie trafia do gita**. Zmienne:

| Zmienna | Opis |
|---|---|
| `ALLOWED_ORIGIN` | Adresy frontendu, po przecinku, bez cudzysłowów: `https://photoidcreator.com,https://www.photoidcreator.com`. Używane do CORS **i** do walidacji adresu powrotu po płatności. |
| `FRONTEND_URL` | Fallback dla `ALLOWED_ORIGIN`. |
| `STRIPE_SECRET_KEY` | `sk_live_...` (produkcja) / `sk_test_...` (dev). |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` z ustawień webhooka w Stripe. |
| `STRIPE_PRICE_IDS` | Dozwolone ceny, po przecinku. Domyślnie ceny z `frontend/src/constants/payments.js`. |
| `ADMIN_KEY` | Klucz do podglądu opinii. |
| `ADMIN_DOWNLOAD_KEY` | Klucz trybu admina (pobranie bez płatności). Pusty = tryb wyłączony. |
| `GOOGLE_ADS_MEASUREMENT_ID`, `GOOGLE_ADS_API_SECRET` | GA4 Measurement Protocol (opcjonalne). |
| `FEEDBACK_FILE` | Plik z opiniami (domyślnie `data/feedback.txt`). |
| `TOKEN_EXPIRE_MINUTES` | Czas na opłacenie pliku (domyślnie 60). |
| `PAID_TOKEN_EXPIRE_MINUTES` | Jak długo plik jest dostępny po opłaceniu (domyślnie 1440 = 24 h). |
| `MAX_UPLOAD_BYTES` | Limit uploadu (domyślnie 25 MB). |
| `TORCH_NUM_THREADS` | Wątki CPU dla modelu (domyślnie min(4, liczba CPU)). |

---

## 4. Deploy

### Frontend → GitHub Pages

```bash
cd frontend
npm run deploy      # build + publikacja na gałąź gh-pages
```

- Domena ustawiona przez `public/CNAME` (`photoidcreator.com`).
- Zmiany są widoczne po 1–2 minutach (cache CDN GitHuba – w razie czego twarde odświeżenie Ctrl+F5).
- **Nie** wpisuj ręcznie nazw plików `static/js/main.*.js` do `public/index.html` – build robi to sam.

### Backend → Hetzner VPS (Docker)

Serwer: `root@46.225.109.176` (Ubuntu 24.04, 4 vCPU, 8 GB RAM). Klucz SSH `~/.ssh/id_ed25519` (z hasłem).

Jak to jest zorganizowane:
- repozytorium: **`/document_photo`** (klon z GitHuba), konfiguracja w `/document_photo/backend/.env`,
- kontener **`backend_app_1`** z obrazu **`backend-app:latest`**, uvicorn na porcie 8080,
- pliki klientów: katalog **`/downloads`** na serwerze (podpięty jako `/app/downloads`),
- **nginx** (`/etc/nginx/sites-enabled/api.photoidcreator.com`) z certyfikatem Let's Encrypt (certbot)
  przekazuje `https://api.photoidcreator.com` → `127.0.0.1:8080`.

#### Aktualizacja backendu (każdy deploy)

```bash
ssh root@46.225.109.176
cd /document_photo
git pull
cd backend
docker tag backend-app:latest backend-app:prev     # kopia poprzedniej wersji na wypadek wycofania
docker build -t backend-app:latest .
docker stop backend_app_1 && docker rm backend_app_1
docker run -d --name backend_app_1 \
  --restart unless-stopped \
  -p 127.0.0.1:8080:8080 \
  -v /downloads:/app/downloads \
  -v /data:/app/data \
  -v photoid-models:/root/.transparent-background \
  --memory 6g \
  --env-file .env \
  backend-app:latest
docker logs -f backend_app_1          # poczekaj na "Application startup complete", wyjście: Ctrl+C
curl http://127.0.0.1:8080/ping
```

Wycofanie wersji (gdy nowa nie działa): te same `docker stop`/`docker rm`, a w `docker run`
zamiast `backend-app:latest` podaj `backend-app:prev`.

Build obrazu trwa kilka minut (torch). Strona nie działa tylko między `docker stop` a startem nowego
kontenera (~1 min na załadowanie modelu) – najlepiej robić to wieczorem.

Opcje `docker run` – dlaczego:
- `--restart unless-stopped` – kontener wstaje sam po restarcie serwera (wcześniej było `Restart=no`!),
- `-p 127.0.0.1:8080:8080` – API tylko przez nginx/HTTPS (wcześniej port 8080 był otwarty dla całego internetu),
- `-v /data:/app/data` – opinie użytkowników przetrwają przebudowę kontenera,
- `-v photoid-models:...` – model (~370 MB) nie jest pobierany przy każdym starcie,
- `--memory 6g` – model zużywa ~5 GB; limit chroni resztę serwera.
- **Tylko 1 worker uvicorn** (tak jest w Dockerfile) – dwa workery = dwie kopie modelu = brak RAM.

#### Jednorazowe poprawki serwera (do zrobienia przy najbliższym deployu)

```bash
# 1. PRZED usunięciem starego kontenera – uratuj opinie zapisane w jego środku
#    (ścieżka zależy od FEEDBACK_FILE w .env; sprawdź: grep FEEDBACK /document_photo/backend/.env)
mkdir -p /data
docker cp backend_app_1:/app/data/feedback.txt /data/feedback.txt
#    w .env ustaw FEEDBACK_FILE=data/feedback.txt (albo usuń tę linię – to wartość domyślna),
#    żeby plik trafiał do podpiętego katalogu /data

# 2. swap 4 GB (teraz jest 0 B – skok zużycia RAM przez model może zabić proces)
fallocate -l 4G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# 3. sprawdzić .env – ALLOWED_ORIGIN musi zawierać dokładny adres frontendu (bez cudzysłowów):
#    ALLOWED_ORIGIN=https://photoidcreator.com,https://www.photoidcreator.com
nano /document_photo/backend/.env

# 4. nginx – limit uploadu i dłuższy timeout (usuwanie tła ~20–30 s, kolejne zdjęcia czekają w kolejce)
nano /etc/nginx/sites-enabled/api.photoidcreator.com
#    w bloku "server { listen 443 ..." dopisz:
#        client_max_body_size 30M;
#        proxy_read_timeout 120s;
nginx -t && systemctl reload nginx

# 5. aktualizacje systemu i restart (serwer zgłasza "System restart required")
#    – dopiero gdy kontener ma --restart unless-stopped (krok z sekcji wyżej)
apt update && apt upgrade -y
reboot
```

Po restarcie sprawdź: `docker ps` (kontener `Up`) i `curl https://api.photoidcreator.com/ping`.

#### Pozostałości na serwerze

- `/etc/nginx/sites-enabled/photoidcreator` – stara konfiguracja frontendu; frontend jest na GitHub Pages,
  więc nie jest używana (DNS `photoidcreator.com` wskazuje na GitHuba).
- Certyfikat Let's Encrypt odnawia się automatycznie (certbot timer). Sprawdzenie: `certbot renew --dry-run`.

### Stripe (produkcja)

- Webhook: `https://api.photoidcreator.com/api/payments/webhook`
- Zdarzenia: `checkout.session.completed` **i** `checkout.session.async_payment_succeeded`
- Signing secret webhooka → `STRIPE_WEBHOOK_SECRET`.
- Nowa cena: dodaj ją w Stripe, wpisz w `frontend/src/constants/payments.js` **oraz** w `STRIPE_PRICE_IDS` na serwerze
  (inaczej backend odrzuci ją jako „Nieprawidłowa cena”).

---

## 5. Aktualizowanie projektu

Typowy cykl:

```bash
git checkout -b nazwa-zmiany
# ... zmiany ...
git commit -am "Opis zmiany"
git checkout master && git merge nazwa-zmiany && git push
# deploy frontendu i/lub backendu (sekcja 4)
```

- **Tłumaczenia:** nowy tekst dodaj do **wszystkich 6** plików `frontend/src/locales/*/translation.json`
  (pl, en, de, es, fr, ua).
- **Zależności frontendu:** `npm install pakiet@wersja`, potem `npm run build` i sprawdzenie aplikacji.
- **Zależności backendu:** zmień `backend/requirements.txt`, przebuduj obraz Dockera.
  Uwaga: plik jest zapisany w UTF-16 – edytuj go w PyCharmie, nie zmieniaj kodowania przypadkiem.
- **Model usuwania tła:** porównanie modeli i trybów jest w `Desktop\fotos\porownanie\WYNIKI.md`.
  Wniosek: zostajemy przy InSPyReNet `base` (BiRefNet i tryb `fast` gorsze, `jit` nie przyspiesza).

---

## 6. Diagnostyka

| Problem | Gdzie patrzeć |
|---|---|
| Backend nie odpowiada | `docker logs backend_app_1`, `docker ps`, `free -h` (brak RAM?) |
| Błąd CORS w przeglądarce | `ALLOWED_ORIGIN` – dokładny adres frontendu, bez cudzysłowów i końcowego `/` |
| „Nieprawidłowy adres przekierowania” | adres strony nie jest w `ALLOWED_ORIGIN` (np. brak wersji `www.`) |
| Klient zapłacił, a plik się nie pobiera | logi webhooka (`[Stripe]` w `docker logs`), Stripe Dashboard → Webhooks → zdarzenia i odpowiedzi |
| „Link wygasł” | token przeterminowany (`TOKEN_EXPIRE_MINUTES` / `PAID_TOKEN_EXPIRE_MINUTES`) albo brak pliku w `downloads/` |
| Usuwanie tła bardzo wolne | obciążenie serwera (`top`), `TORCH_NUM_THREADS` |

---

## 7. Bezpieczeństwo

- Nie commituj `.env`, `.env_dev`, `frontend/.env` ani `backend/downloads/` (zdjęcia klientów).
- `backend/.dockerignore` musi zawierać `.env` – na serwerze sekrety idą przez `--env-file .env`, nie są wbudowywane w obraz.
- Nie używaj `REACT_APP_*` do sekretów – wszystko z prefiksem `REACT_APP_` trafia do publicznego bundla.
