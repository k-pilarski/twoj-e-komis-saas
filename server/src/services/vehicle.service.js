import { prisma } from "../lib/prisma.js";

// Walidacja reguł biznesowych na backendzie (ochrona przed pominięciem frontendu)
const validateVehiclePayload = (data) => {
  const currentYear = new Date().getFullYear();
  const todayStr = new Date().toISOString().split('T')[0];

  if (!data.brand || !String(data.brand).trim() || !data.model || !String(data.model).trim()) {
    throw new Error('VALIDATION:Marka i model są wymagane.');
  }

  const year = Number(data.year);
  if (!Number.isInteger(year) || year < 1887 || year > currentYear) {
    throw new Error(`VALIDATION:Rocznik musi mieścić się w przedziale 1887 - ${currentYear}.`);
  }

  const price = Number(data.price);
  if (isNaN(price) || price < 100 || price > 10000000) {
    throw new Error('VALIDATION:Cena musi wynosić od 100 do 10 000 000 PLN.');
  }

  if (data.vin) {
    const vin = String(data.vin).trim().toUpperCase();
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
      throw new Error('VALIDATION:Numer VIN musi mieć dokładnie 17 znaków (A-Z bez I, O, Q oraz 0-9).');
    }
  }

  if (data.licensePlate) {
    const plate = String(data.licensePlate).trim().toUpperCase();
    if (!/^[A-Z0-9]{1,8}$/.test(plate)) {
      throw new Error('VALIDATION:Numer rejestracyjny może zawierać maksymalnie 8 znaków alfanumerycznych.');
    }
  }

  if (data.firstRegistration) {
    const minDateStr = `${year}-01-01`;
    if (data.firstRegistration < minDateStr || data.firstRegistration > todayStr) {
      throw new Error('VALIDATION:Data pierwszej rejestracji jest nieprawidłowa względem rocznika lub dzisiejszej daty.');
    }
  }

  if (Boolean(data.isImported) && (!data.importedFrom || !String(data.importedFrom).trim())) {
    throw new Error('VALIDATION:Kraj pochodzenia jest wymagany dla pojazdu importowanego.');
  }

  if (data.doors !== undefined && data.doors !== null && data.doors !== '') {
    const doors = Number(data.doors);
    if (!Number.isInteger(doors) || doors < 1 || doors > 9) {
      throw new Error('VALIDATION:Liczba drzwi musi mieścić się w przedziale 1 - 9.');
    }
  }

  if (data.seats !== undefined && data.seats !== null && data.seats !== '') {
    const seats = Number(data.seats);
    if (!Number.isInteger(seats) || seats < 1 || seats > 100) {
      throw new Error('VALIDATION:Liczba miejsc musi mieścić się w przedziale 1 - 100.');
    }
  }
};

const mapVehicleData = (data, tenantId) => {
  const isImported = Boolean(data.isImported);

  return {
    brand: String(data.brand).trim(),
    model: String(data.model).trim(),
    year: parseInt(data.year, 10),
    price: parseFloat(data.price),
    description: data.description ? String(data.description).trim() : '',
    
    vin: data.vin ? String(data.vin).trim().toUpperCase() : null,
    licensePlate: data.licensePlate ? String(data.licensePlate).trim().toUpperCase() : null,
    firstRegistration: data.firstRegistration || null,
    mileage: data.mileage !== '' && data.mileage !== null && data.mileage !== undefined ? parseInt(data.mileage, 10) : null,
    
    fuelType: data.fuelType || null,
    engineCapacity: data.engineCapacity !== '' && data.engineCapacity !== null && data.engineCapacity !== undefined ? parseInt(data.engineCapacity, 10) : null,
    enginePower: data.enginePower !== '' && data.enginePower !== null && data.enginePower !== undefined ? parseInt(data.enginePower, 10) : null,
    transmission: data.transmission || null,
    drivetrain: data.drivetrain || null,
    bodyType: data.bodyType || null,
    color: data.color ? String(data.color).trim() : null,
    doors: data.doors !== '' && data.doors !== null && data.doors !== undefined ? parseInt(data.doors, 10) : null,
    seats: data.seats !== '' && data.seats !== null && data.seats !== undefined ? parseInt(data.seats, 10) : null,
    
    isDamaged: Boolean(data.isDamaged),
    isImported,
    importedFrom: isImported && data.importedFrom ? String(data.importedFrom).trim() : null,
    
    ...(tenantId && { tenantId })
  };
};

export const getVehiclesService = async (tenantId) => {
  return await prisma.vehicle.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' }
  });
};

export const getVehicleByIdService = async (tenantId, vehicleId) => {
  const vehicle = await prisma.vehicle.findFirst({
    where: { id: vehicleId, tenantId }
  });

  if (!vehicle) {
    throw new Error('NOT_FOUND_OR_UNAUTHORIZED');
  }

  return vehicle;
};

export const createVehicleService = async (tenantId, vehicleData) => {
  validateVehiclePayload(vehicleData);
  return await prisma.vehicle.create({
    data: mapVehicleData(vehicleData, tenantId)
  });
};

export const updateVehicleService = async (tenantId, vehicleId, vehicleData) => {
  const existingVehicle = await prisma.vehicle.findFirst({
    where: { id: vehicleId, tenantId }
  });

  if (!existingVehicle) {
    throw new Error('NOT_FOUND_OR_UNAUTHORIZED');
  }

  validateVehiclePayload(vehicleData);

  return await prisma.vehicle.update({
    where: { id: vehicleId },
    data: mapVehicleData(vehicleData)
  });
};

export const deleteVehicleService = async (tenantId, vehicleId) => {
  const existingVehicle = await prisma.vehicle.findFirst({
    where: { id: vehicleId, tenantId }
  });

  if (!existingVehicle) {
    throw new Error('NOT_FOUND_OR_UNAUTHORIZED');
  }

  await prisma.vehicle.delete({
    where: { id: vehicleId }
  });
};