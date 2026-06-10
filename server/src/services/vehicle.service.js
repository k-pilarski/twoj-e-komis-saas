import { prisma } from "../lib/prisma.js";

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

// Funkcja pomocnicza do mapowania danych pojazdu (żeby nie pisać tego samego dwa razy)
const mapVehicleData = (data, tenantId) => {
  return {
    brand: data.brand,
    model: data.model,
    year: parseInt(data.year),
    price: parseFloat(data.price),
    description: data.description || '',
    
    vin: data.vin || null,
    licensePlate: data.licensePlate || null,
    firstRegistration: data.firstRegistration || null,
    mileage: data.mileage ? parseInt(data.mileage) : null,
    
    fuelType: data.fuelType || null,
    engineCapacity: data.engineCapacity ? parseInt(data.engineCapacity) : null,
    enginePower: data.enginePower ? parseInt(data.enginePower) : null,
    transmission: data.transmission || null,
    drivetrain: data.drivetrain || null,
    bodyType: data.bodyType || null,
    color: data.color || null,
    doors: data.doors ? parseInt(data.doors) : null,
    seats: data.seats ? parseInt(data.seats) : null,
    
    isDamaged: Boolean(data.isDamaged),
    isImported: Boolean(data.isImported),
    importedFrom: Boolean(data.isImported) ? (data.importedFrom || null) : null,
    
    ...(tenantId && { tenantId }) // Dodaje tenantId tylko przy tworzeniu
  };
};

export const createVehicleService = async (tenantId, vehicleData) => {
  return await prisma.vehicle.create({
    data: mapVehicleData(vehicleData, tenantId)
  });
};

export const updateVehicleService = async (tenantId, vehicleId, vehicleData) => {
  // Weryfikacja uprawnień komisu do tego konkretnego auta
  const existingVehicle = await prisma.vehicle.findFirst({
    where: { id: vehicleId, tenantId }
  });

  if (!existingVehicle) {
    throw new Error('NOT_FOUND_OR_UNAUTHORIZED');
  }

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