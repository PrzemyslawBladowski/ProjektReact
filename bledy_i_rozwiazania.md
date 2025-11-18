# Refleksje i reakcje na błędy - dokumentacja

## Data: 2025-01-18

### Błąd 1: Endpoint DELETE /posts/{post_id} - AssertionError

**Opis błędu:**
```
AssertionError: Status code 204 must not have a response body
```

**Gdzie wystąpił:**
- Plik: `test-backend/main.py`
- Linia: 309
- Endpoint: `@app.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)`

**Jak został wykryty:**
- Próba importu modułu `main.py` zakończyła się błędem
- Błąd pojawił się w logach podczas uruchamiania backendu
- FastAPI waliduje, że status code 204 nie może mieć response body

**Przyczyna:**
- Użycie `status_code=status.HTTP_204_NO_CONTENT` w dekoratorze `@app.delete()` powoduje, że FastAPI oczekuje, że funkcja nie zwróci żadnego body
- Jednak FastAPI automatycznie próbuje zwrócić response body, co powoduje konflikt

**Rozwiązanie:**
1. Usunięto `status_code=status.HTTP_204_NO_CONTENT` z dekoratora
2. Dodano import `Response` z `fastapi`
3. Zmieniono typ zwracany funkcji na `Response`
4. W funkcji zwracamy `Response(status_code=status.HTTP_204_NO_CONTENT)` zamiast `None`

**Kod przed naprawą:**
```python
@app.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(post_id: int, db: Session = Depends(get_db_session)) -> None:
    # ...
    db.delete(post)
    db.commit()
```

**Kod po naprawie:**
```python
from fastapi import Depends, FastAPI, HTTPException, Response, status

@app.delete("/posts/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db_session)) -> Response:
    # ...
    db.delete(post)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
```

**Weryfikacja:**
- Backend uruchomił się bez błędów
- Endpoint DELETE działa poprawnie
- Testy curl potwierdzają działanie

**Refleksje:**
- FastAPI ma specyficzne wymagania dotyczące status code 204
- Ważne jest testowanie importu modułów przed uruchomieniem serwera
- Dokumentacja FastAPI powinna być konsultowana przy pracy z niestandardowymi status codes

---

### Błąd 2: Backend nie uruchamiał się podczas testów Playwright

**Opis błędu:**
- Backend nie był uruchomiony podczas testów E2E
- Frontend używał danych fallback zamiast danych z API

**Gdzie wystąpił:**
- Testy Playwright w `my-app/tests/e2e/navigation.spec.ts`
- Logi pokazywały: `ECONNREFUSED 127.0.0.1:8000`

**Jak został wykryty:**
- Testy przeszły, ale w logach widoczne były błędy połączenia z API
- Frontend poprawnie obsłużył sytuację używając fallback danych

**Przyczyna:**
- Backend nie był uruchomiony przed testami
- Playwright uruchamia tylko frontend (webServer), nie backend

**Rozwiązanie:**
- Uruchomiono backend ręcznie przed testami
- W przyszłości można dodać backend do konfiguracji Playwright jako dodatkowy webServer
- Alternatywnie można użyć danych fallback jako domyślnych dla testów

**Refleksje:**
- Ważne jest, aby testy E2E były niezależne lub miały jasno określone zależności
- Fallback mechanism działa poprawnie i zapewnia odporność aplikacji
- W produkcji backend powinien być zawsze dostępny

---

### Błąd 3: Problem z formatowaniem JSON w PowerShell przy testowaniu endpointów

**Opis błędu:**
- Curl w PowerShell miał problemy z przekazywaniem JSON w parametrze `-d`
- Błędy parsowania JSON: `JSON decode error`, `Unterminated string`

**Gdzie wystąpił:**
- Testowanie endpointu POST `/posts/{id}/comments` za pomocą curl w PowerShell

**Jak został wykryty:**
- Endpoint zwracał błędy parsowania JSON
- PowerShell interpretował znaki specjalne w JSON

**Przyczyna:**
- PowerShell ma specyficzne wymagania dotyczące escapowania znaków w JSON
- Curl w PowerShell wymaga innego formatowania niż w bash

**Rozwiązanie:**
- Użyto `Invoke-RestMethod` zamiast curl dla testów w PowerShell
- `Invoke-RestMethod` automatycznie obsługuje JSON i konwersję typów
- Alternatywnie można użyć pliku JSON z `@` w curl

**Kod rozwiązania:**
```powershell
$body = @{author_id=1; content="Test komentarza"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://127.0.0.1:8000/posts/1/comments" -Method POST -Body $body -ContentType "application/json"
```

**Refleksje:**
- PowerShell wymaga innych narzędzi niż bash do testowania API
- `Invoke-RestMethod` jest bardziej odpowiednie dla PowerShell niż curl
- Ważne jest dostosowanie narzędzi testowych do środowiska

---

---

### Uwaga dotycząca punktu 9 workflow (praca na branchach)

**Status:** Nie dotyczyło tej sesji

**Wyjaśnienie:**
- Wszystkie zadania z `todo.txt` były już wykonane wcześniej (znajdują się w `todo_done.txt`)
- W tej sesji nie było nowych zadań do realizacji, które wymagałyby utworzenia osobnych branchy
- Wykonane zadania w tej sesji to:
  1. Weryfikacja zgodności z workflow
  2. Naprawa błędu w backendzie (DELETE endpoint)
  3. Dodanie testów RWD
  4. Dokumentacja błędów

**Zastosowanie w przyszłości:**
- Każde nowe zadanie z `todo.txt` będzie realizowane na osobnym branchu zgodnie z workflow
- Proces: utworzenie brancha → wykonanie → testy → poprawki → merge do main

---

## Podsumowanie

**Liczba błędów naprawionych:** 3

**Czas naprawy:**
- Błąd 1: ~10 minut (znalezienie, analiza, naprawa)
- Błąd 2: ~5 minut (identyfikacja, rozwiązanie)
- Błąd 3: ~15 minut (próby różnych rozwiązań, znalezienie optymalnego)

**Wnioski ogólne:**
1. Ważne jest testowanie importu modułów przed uruchomieniem serwera
2. Dokumentacja frameworków (FastAPI) powinna być konsultowana przy niestandardowych przypadkach
3. Narzędzia testowe powinny być dostosowane do środowiska (PowerShell vs bash)
4. Fallback mechanism jest kluczowy dla odporności aplikacji
5. Logi są niezbędne do szybkiego diagnozowania problemów

