# Twój E-Komis (SaaS) 🚗

Nowoczesna platforma SaaS (Software as a Service) stworzona z myślą o właścicielach komisów samochodowych. Aplikacja umożliwia łatwe zarządzanie inwentarzem pojazdów oraz błyskawiczne wygenerowanie publicznej wizytówki (strony internetowej) komisu.

## 🚀 Główne funkcje
- **Zarządzanie kontami (Multi-tenant):** Logowanie, rejestracja, wsparcie dla wielu komisów z bezpiecznym podziałem danych.
- **Zarządzanie flotą (wkrótce):** Dodawanie, edycja i usuwanie pojazdów.
- **Kreator stron (wkrótce):** Generowanie unikalnych stron dla każdego komisu.
- **System subskrypcji:** Wbudowana blokada dla nieopłaconych kont i 30-dniowy okres próbny.

## 💻 Tech Stack
- **Frontend:** React, TailwindCSS, React Router
- **Backend:** Node.js, Express.js
- **Baza danych:** PostgreSQL + Prisma ORM
- **Autoryzacja:** JWT (JSON Web Tokens), bcrypt

## 🛠️ Jak uruchomić projekt lokalnie?

1. Sklonuj repozytorium:
```bash
git clone [https://github.com/k-pilarski/twoj-ekomis.git](https://github.com/k-pilarski/twoj-ekomis.git)
```

2. Zainstaluj zależności dla backendu i frontendu:
```bash
# W folderze serwera
cd server
npm install

# W folderze klienta
cd ../client
npm install
```

3. Skonfiguruj zmienne środowiskowe:
Utwórz plik `.env` w folderze `server` i dodaj dane dostępowe do bazy PostgreSQL oraz `JWT_SECRET`.

4. Zbuduj bazę danych:
```bash
cd server
npx prisma migrate dev
```

5. Odpal serwery deweloperskie:
```bash
# Terminal 1 (Backend)
cd server
npm run dev

# Terminal 2 (Frontend)
cd client
npm run dev
```