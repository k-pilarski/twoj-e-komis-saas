// server/src/controllers/public.controller.js
import { getPublicStorefrontService } from "../services/public.service.js";

export const getPublicStorefront = async (req, res) => {
  try {
    const storefrontData = await getPublicStorefrontService(req.params.slug);
    res.status(200).json(storefrontData);
  } catch (error) {
    if (error.message === 'STOREFRONT_NOT_FOUND') {
      return res.status(404).json({ error: 'Komis o podanym adresie nie istnieje.' });
    }
    if (error.message === 'STOREFRONT_INACTIVE') {
      return res.status(403).json({ error: 'Wizytówka tego komisu jest obecnie nieaktywna.' });
    }
    console.error('Błąd pobierania publicznej wizytówki:', error);
    res.status(500).json({ error: 'Wystąpił błąd podczas ładowania strony komisu.' });
  }
};