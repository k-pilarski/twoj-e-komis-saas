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

export const createVehicleService = async (tenantId, vehicleData) => {
  const { brand, model, price, year, description } = vehicleData;

  return await prisma.vehicle.create({
    data: {
      brand,
      model,
      price: parseFloat(price),
      year: parseInt(year),
      description: description || '',
      tenantId
    }
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

  const { brand, model, price, year, description } = vehicleData;

  return await prisma.vehicle.update({
    where: { id: vehicleId },
    data: {
      brand,
      model,
      price: parseFloat(price),
      year: parseInt(year),
      description
    }
  });
};

export const deleteVehicleService = async (tenantId, vehicleId) => {
  // Weryfikacja uprawnień
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