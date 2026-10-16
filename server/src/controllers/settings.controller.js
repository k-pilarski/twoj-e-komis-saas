import { getSettingsService, updateSettingsService } from "../services/settings.service.js";

export const getSettings = async (req, res) => {
  try {
    const settings = await getSettingsService(req.user.tenantId);
    res.status(200).json(settings);
  } catch (error) {
    console.error('Błąd pobierania ustawień:', error);
    res.status(500).json({ error: 'Nie udało się pobrać konfiguracji.' });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const updatedSettings = await updateSettingsService(req.user.tenantId, req.body);
    res.status(200).json({ message: 'Ustawienia zapisane pomyślnie.', settings: updatedSettings });
  } catch (error) {
    console.error('Błąd aktualizacji ustawień:', error);
    res.status(500).json({ error: 'Nie udało się zapisać konfiguracji.' });
  }
};