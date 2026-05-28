// Importy

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

dotenv.config(); // Ładowanie zmiennych środowiskowych z pliku .env

const app = express(); // Inicjalizacja aplikacji
const PORT = process.env.PORT || 5000; // Wybór portu

// Middleware
app.use(cors()); // Pozwala na zapytania z innego portu (z Reacta)
app.use(express.json()); // Pozwala Expressowi czytać dane w formacie JSON

// Trasy publiczne
app.use('/api/auth', authRoutes);

// Trasy prywatne
app.use('/api/dashboard', dashboardRoutes);

// Prosty endpoint testowy
app.get('/api/test', (req, res) => {
  res.json({ message: 'Serwer Express działa jak złoto!' });
});

// Uruchomienie serwera
app.listen(PORT, () => {
  console.log(`💻 Serwer wystartował na porcie http://localhost:${PORT}`);
});