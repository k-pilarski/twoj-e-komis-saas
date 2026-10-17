// server/src/controllers/document.controller.js
import { generateSaleAgreementService } from "../services/document.service.js";

export const createSaleAgreement = async (req, res) => {
  try {
    const agreementData = await generateSaleAgreementService(req.user.tenantId, req.body);
    res.status(200).json({
      message: 'Umowa została wygenerowana pomyślnie.',
      agreement: agreementData
    });
  } catch (error) {
    if (error.message === 'NOT_FOUND_OR_UNAUTHORIZED') {
      return res.status(404).json({ error: 'Wybrany pojazd nie istnieje lub nie należy do Twojego komisu.' });
    }
    if (error.message?.startsWith('VALIDATION:')) {
      return res.status(400).json({ error: error.message.replace('VALIDATION:', '') });
    }
    console.error('Błąd generowania umowy:', error);
    res.status(500).json({ error: 'Wystąpił błąd serwera podczas przygotowywania umowy.' });
  }
};