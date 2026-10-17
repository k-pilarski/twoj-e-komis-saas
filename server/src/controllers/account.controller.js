// server/src/controllers/account.controller.js
import {
  getAccountDetailsService,
  updateAccountProfileService,
  changeAccountPasswordService
} from "../services/account.service.js";

export const getAccountDetails = async (req, res) => {
  try {
    const accountData = await getAccountDetailsService(req.user.tenantId);
    res.status(200).json(accountData);
  } catch (error) {
    console.error('Błąd pobierania danych konta:', error);
    res.status(500).json({ error: 'Nie udało się pobrać informacji o koncie.' });
  }
};

export const updateAccountProfile = async (req, res) => {
  try {
    const updatedData = await updateAccountProfileService(req.user.tenantId, req.body);
    res.status(200).json({
      message: 'Dane profilu zostały zaktualizowane.',
      ...updatedData
    });
  } catch (error) {
    if (error.message === 'EMAIL_TAKEN') {
      return res.status(409).json({ error: 'Podany adres e-mail jest już przypisany do innego konta.' });
    }
    if (error.message?.startsWith('VALIDATION:')) {
      return res.status(400).json({ error: error.message.replace('VALIDATION:', '') });
    }
    console.error('Błąd aktualizacji profilu:', error);
    res.status(500).json({ error: 'Wystąpił błąd podczas zapisywania danych profilu.' });
  }
};

export const changeAccountPassword = async (req, res) => {
  try {
    await changeAccountPasswordService(req.user.tenantId, req.body);
    res.status(200).json({ message: 'Hasło zostało pomyślnie zmienione.' });
  } catch (error) {
    if (error.message === 'INVALID_CURRENT_PASSWORD') {
      return res.status(401).json({ error: 'Podane obecne hasło jest nieprawidłowe.' });
    }
    if (error.message?.startsWith('VALIDATION:')) {
      return res.status(400).json({ error: error.message.replace('VALIDATION:', '') });
    }
    console.error('Błąd zmiany hasła:', error);
    res.status(500).json({ error: 'Wystąpił błąd podczas zmiany hasła.' });
  }
};