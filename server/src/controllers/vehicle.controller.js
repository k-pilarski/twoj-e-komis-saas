import { 
  getVehiclesService, 
  getVehicleByIdService,
  createVehicleService, 
  updateVehicleService, 
  deleteVehicleService 
} from "../services/vehicle.service.js";

export const getVehicles = async (req, res) => {
  try {
    const vehicles = await getVehiclesService(req.user.tenantId);
    res.status(200).json(vehicles);
  } catch (error) {
    console.error('Błąd pobierania pojazdów:', error);
    res.status(500).json({ error: 'Nie udało się pobrać listy pojazdów.' });
  }
};

export const getVehicle = async (req, res) => {
  try {
    const vehicle = await getVehicleByIdService(req.user.tenantId, req.params.id);
    res.status(200).json(vehicle);
  } catch (error) {
    if (error.message === 'NOT_FOUND_OR_UNAUTHORIZED') {
      return res.status(404).json({ error: 'Pojazd nie istnieje lub brak uprawnień.' });
    }
    console.error('Błąd pobierania pojazdu:', error);
    res.status(500).json({ error: 'Nie udało się pobrać danych pojazdu.' });
  }
};

export const createVehicle = async (req, res) => {
  try {
    const { brand, model, price, year } = req.body;

    if (!brand || !model || !price || !year) {
      return res.status(400).json({ error: 'Marka, model, cena i rocznik są wymagane.' });
    }

    const newVehicle = await createVehicleService(req.user.tenantId, req.body);
    res.status(201).json({ message: 'Pojazd dodany pomyślnie.', vehicle: newVehicle });
  } catch (error) {
    console.error('Błąd dodawania pojazdu:', error);
    res.status(500).json({ error: 'Nie udało się dodać pojazdu.' });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const updatedVehicle = await updateVehicleService(req.user.tenantId, req.params.id, req.body);
    res.status(200).json({ message: 'Zaktualizowano dane pojazdu.', vehicle: updatedVehicle });
  } catch (error) {
    if (error.message === 'NOT_FOUND_OR_UNAUTHORIZED') {
      return res.status(404).json({ error: 'Pojazd nie istnieje lub brak uprawnień.' });
    }
    console.error('Błąd edycji pojazdu:', error);
    res.status(500).json({ error: 'Nie udało się zaktualizować pojazdu.' });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    await deleteVehicleService(req.user.tenantId, req.params.id);
    res.status(200).json({ message: 'Pojazd został usunięty.' });
  } catch (error) {
    if (error.message === 'NOT_FOUND_OR_UNAUTHORIZED') {
      return res.status(404).json({ error: 'Pojazd nie istnieje lub brak uprawnień.' });
    }
    console.error('Błąd usuwania pojazdu:', error);
    res.status(500).json({ error: 'Nie udało się usunąć pojazdu.' });
  }
};