## ScienceHub – połączenie Next.js i FastAPI

Portal łączy frontend oparty na Next.js 14 (App Router) z backendem FastAPI oraz bazą SQLite. Wszystkie dane, które wcześniej były zahardkodowane w `project_example`, trafiają teraz do bazy i są serwowane przez API. Domyślne porty:

- `http://127.0.0.1:3001` – aplikacja Next.js
- `http://127.0.0.1:8000` – FastAPI

## 🚀 Szybkie uruchomienie (Frontend + Backend)

**Najprostszy sposób - uruchom oba serwery jednocześnie:**

```powershell
# Z głównego katalogu projektu
npm run dev:all
```

Lub bezpośrednio:
```powershell
powershell -ExecutionPolicy Bypass -File ./start-dev.ps1
```

Skrypt automatycznie:
- Sprawdzi i utworzy środowisko wirtualne dla backendu (jeśli potrzeba)
- Uruchomi backend FastAPI na porcie 8000 (w osobnym oknie)
- Uruchomi frontend Next.js na porcie 3001

## Backend (FastAPI) - uruchamianie ręczne

```powershell
cd test-backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Po starcie API zostaje zseedowane przykładowymi użytkownikami i postami. Endpointy kluczowe:

- `GET /health` – status serwera
- `GET /users`, `POST /users`, `PATCH /users/{id}`
- `GET /posts`, `POST /posts`, `PUT /posts/{id}`, `DELETE /posts/{id}`
- `POST /posts/{id}/like`, `POST /posts/{id}/share`, `POST /posts/{id}/comments`

## Frontend (Next.js 14 / React 19) - uruchamianie ręczne

```powershell
cd my-app
npm install
Copy-Item env.example .env.local
npm run dev            # nasłuchuje na porcie 3001
```

Zmienne środowiskowe:

- `NEXT_PUBLIC_API_URL` – adres backendu FastAPI (domyślnie `http://127.0.0.1:8000`).

### Kluczowe trasy Frontendu

- `/` – strona główna; Server Component pobiera dane z FastAPI i przekazuje je do komponentu klienckiego `HomeClient`.
- `/contact` – statyczna lista laboratoriów.
- `/contact/gdansk` – strona serwerowa z dynamiczną listą publikacji (połączenie z backendem + fallback).
- `/mix` – przykład współpracy ServerComponent + ClientComponent (`ClientPostCard`).
- `/incr` – panel inkrementacji (czysty Client Component).

## Testy E2E i zrzuty ekranu

Playwright działa w trybie headed tak, aby było widać przebieg testów. Zrzuty ekranu trafiają do katalogu `screenshots/`.

```powershell
cd my-app
npx playwright install
npm run test:e2e:headed
```

Scenariusz `tests/e2e/navigation.spec.ts` sprawdza główne trasy (`/`, `/contact`, `/contact/gdansk`, `/incr`) i generuje zrzut ekranu strony głównej.

## Diagnostyka i narzędzia

- Do szybkiego sprawdzania API używaj `curl` lub `Invoke-WebRequest`, np. `curl http://127.0.0.1:8000/health`.
- Logi backendu znajdziesz w konsoli uvicorn; logi frontu w terminalu `npm run dev`.
- Wszelkie nowe widoki i komentarze piszemy po polsku, zachowując obecny styl UI.

## Kolejne kroki

1. Przed rozpoczęciem pracy wykonaj `git status`, aby znać ewentualne lokalne zmiany.
2. Każde zadanie z `todo.txt` realizujemy na osobnym branchu.
3. Po zakończeniu zadania przenieś wpis do `todo_done.txt`.
