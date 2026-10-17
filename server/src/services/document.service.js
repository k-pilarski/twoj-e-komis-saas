// server/src/services/document.service.js
import { prisma } from "../lib/prisma.js";

const validateSaleAgreementPayload = (data) => {
  const todayStr = new Date().toISOString().split('T')[0];

  if (!data.vehicleId) {
    throw new Error('VALIDATION:Wybierz pojazd, którego dotyczy umowa.');
  }

  const buyerType = data.buyerType === 'COMPANY' ? 'COMPANY' : 'PRIVATE';

  if (!data.buyerName || String(data.buyerName).trim().length < 3) {
    throw new Error('VALIDATION:Podaj pełne imię i nazwisko lub nazwę firmy kupującego.');
  }

  if (!data.buyerAddress || String(data.buyerAddress).trim().length < 5) {
    throw new Error('VALIDATION:Podaj pełny adres zamieszkania lub siedziby kupującego.');
  }

  if (buyerType === 'PRIVATE') {
    const pesel = String(data.buyerPesel || '').replace(/\s+/g, '');
    if (!/^\d{11}$/.test(pesel)) {
      throw new Error('VALIDATION:Numer PESEL kupującego musi składać się z dokładnie 11 cyfr.');
    }

    const idNumber = String(data.buyerIdNumber || '').replace(/[\s-]+/g, '').toUpperCase();
    if (!/^[A-Z0-9]{5,12}$/.test(idNumber)) {
      throw new Error('VALIDATION:Podaj poprawną serię i numer dokumentu tożsamości (5-12 znaków alfanumerycznych).');
    }
  } else {
    const nip = String(data.buyerNip || '').replace(/[\s-]+/g, '');
    if (!/^\d{10}$/.test(nip)) {
      throw new Error('VALIDATION:Numer NIP firmy musi składać się z dokładnie 10 cyfr.');
    }
  }

  const price = Number(data.salePrice);
  if (isNaN(price) || price < 100 || price > 10000000) {
    throw new Error('VALIDATION:Kwota sprzedaży musi wynosić od 100 PLN do 10 000 000 PLN.');
  }

  if (!data.salePlace || String(data.salePlace).trim().length < 2) {
    throw new Error('VALIDATION:Podaj miejscowość zawarcia umowy.');
  }

  if (!data.saleDate || data.saleDate > todayStr) {
    throw new Error('VALIDATION:Data zawarcia umowy jest wymagana i nie może być z przyszłości.');
  }

  const allowedPayments = ['GOTÓWKA', 'PRZELEW'];
  if (data.paymentMethod && !allowedPayments.includes(data.paymentMethod)) {
    throw new Error('VALIDATION:Nieprawidłowa forma płatności.');
  }
};

export const generateSaleAgreementService = async (tenantId, payload) => {
  validateSaleAgreementPayload(payload);

  // 1. Sprawdzenie czy pojazd istnieje i należy do tego komisu (izolacja Multi-Tenant)
  const vehicle = await prisma.vehicle.findFirst({
    where: {
      id: payload.vehicleId,
      tenantId
    }
  });

  if (!vehicle) {
    throw new Error('NOT_FOUND_OR_UNAUTHORIZED');
  }

  // 2. Pobranie danych sprzedającego (Komis + Właściciel + Ustawienia kontaktowe)
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: {
      owner: {
        select: {
          firstName: true,
          lastName: true,
          email: true
        }
      },
      settings: true
    }
  });

  if (!tenant) {
    throw new Error('TENANT_NOT_FOUND');
  }

  const buyerType = payload.buyerType === 'COMPANY' ? 'COMPANY' : 'PRIVATE';
  const now = new Date();
  const contractNumber = `UKS/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${vehicle.id.slice(0, 4).toUpperCase()}`;

  return {
    contractNumber,
    saleDate: payload.saleDate,
    salePlace: String(payload.salePlace).trim(),
    paymentMethod: payload.paymentMethod || 'GOTÓWKA',
    salePrice: parseFloat(payload.salePrice),
    additionalNotes: payload.additionalNotes ? String(payload.additionalNotes).trim() : null,
    seller: {
      dealerName: tenant.name,
      ownerName: [tenant.owner?.firstName, tenant.owner?.lastName].filter(Boolean).join(' ') || tenant.name,
      address: tenant.settings?.address || 'Brak wpisanego adresu w ustawieniach wizytówki',
      phoneNumber: tenant.settings?.phoneNumber || null,
      email: tenant.owner?.email || null
    },
    buyer: {
      type: buyerType,
      name: String(payload.buyerName).trim(),
      address: String(payload.buyerAddress).trim(),
      pesel: buyerType === 'PRIVATE' ? String(payload.buyerPesel).replace(/\s+/g, '') : null,
      idNumber: buyerType === 'PRIVATE' ? String(payload.buyerIdNumber).replace(/[\s-]+/g, '').toUpperCase() : null,
      nip: buyerType === 'COMPANY' ? String(payload.buyerNip).replace(/[\s-]+/g, '') : null
    },
    vehicle: {
      id: vehicle.id,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      vin: vehicle.vin || 'Brak w ewidencji',
      licensePlate: vehicle.licensePlate || 'Brak tablic',
      mileage: vehicle.mileage,
      engineCapacity: vehicle.engineCapacity,
      enginePower: vehicle.enginePower,
      fuelType: vehicle.fuelType,
      color: vehicle.color,
      isDamaged: vehicle.isDamaged
    }
  };
};