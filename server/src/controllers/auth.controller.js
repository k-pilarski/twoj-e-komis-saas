import { registerUserService, loginUserService } from '../services/auth.service.js';

export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, tenantName, tenantSlug } = req.body;

    if (!email || !password || !firstName || !lastName || !tenantName || !tenantSlug) {
      return res.status(400).json({ error: 'Proszę wypełnić wszystkie pola formularza.' });
    }

    const { user, token } = await registerUserService(req.body);

    res.status(201).json({
      message: 'Konto zostało pomyślnie utworzone!',
      token,
      user: {
        id: user.id,
        email: user.email,
        tenantSlug: user.tenant.slug
      }
    });

  } catch (error) {
    if (error.message === 'EMAIL_EXISTS') {
      return res.status(400).json({ error: 'Użytkownik z tym adresem email już istnieje.' });
    }
    if (error.message === 'SLUG_EXISTS') {
      return res.status(400).json({ error: 'Ten adres URL komisu jest już zajęty.' });
    }
    
    console.error('Błąd podczas rejestracji:', error);
    res.status(500).json({ error: 'Wystąpił wewnętrzny błąd serwera.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Proszę wypełnić wszystkie pola logowania.' });
    }

    const { user, token } = await loginUserService(email, password);

    res.status(200).json({
      message: 'Zalogowano pomyślnie!',
      token,
      user: {
        id: user.id,
        email: user.email,
        tenantSlug: user.tenant.slug
      }
    });

  } catch (error) {
    if (error.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ error: 'Nieprawidłowy adres email lub hasło.' });
    }

    console.error('Błąd podczas logowania:', error);
    res.status(500).json({ error: 'Wystąpił wewnętrzny błąd serwera.' });
  }
};