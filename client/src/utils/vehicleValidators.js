// client/src/utils/vehicleValidators.js

// Marka, Model, Kraj: Pierwsza litera każdego członu (po spacji lub myślniku) wielka,
// bez przymusowego zmniejszania wielkich liter w skrótowcach (np. BMW, GT-R, USA)
export const formatSmartTitleCase = (value) => {
  if (!value) return '';
  return value
    .replace(/^\s+/, '') // Usuń spacje na samym początku
    .replace(/\s{2,}/g, ' ') // Zamień podwójne spacje na pojedyncze
    .replace(/(^|[\s-])([a-ząćęłńóśźż])/g, (match, separator, char) => {
      return separator + char.toUpperCase();
    });
};

// Numer VIN: Tylko A-Z (bez I, O, Q) oraz 0-9, bez spacji i znaków specjalnych, max 17 znaków
export const formatVin = (value) => {
  if (!value) return '';
  return value
    .toUpperCase()
    .replace(/[^A-HJ-NPR-Z0-9]/g, '')
    .slice(0, 17);
};

// Numer rejestracyjny: Tylko litery A-Z i cyfry 0-9, bez spacji i znaków specjalnych, max 8 znaków
export const formatLicensePlate = (value) => {
  if (!value) return '';
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 8);
};

// Tylko liczby całkowite dodatnie (dla rocznika, przebiegu, mocy, pojemności, drzwi, miejsc)
export const formatPositiveInteger = (value) => {
  if (value === '' || value === null || value === undefined) return '';
  return String(value).replace(/\D/g, '');
};

// Cena: Liczba dodatnia z maksymalnie 2 miejscami po kropce, bez spacji i znaków specjalnych
export const formatPrice = (value) => {
  if (value === '' || value === null || value === undefined) return '';
  const cleaned = String(value).replace(',', '.').replace(/[^0-9.]/g, '');
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    return `${parts[0]}.${parts.slice(1).join('').slice(0, 2)}`;
  }
  if (parts.length === 2) {
    return `${parts[0]}.${parts[1].slice(0, 2)}`;
  }
  return cleaned;
};

// Przelicznik kW na KM (1 kW ≈ 1.35962 KM)
export const calculateHorsepower = (kw) => {
  const num = parseFloat(kw);
  if (isNaN(num) || num <= 0) return null;
  return Math.round(num * 1.35962);
};

// Kompleksowa walidacja formularza przed wysyłką
export const validateVehicleForm = (formData) => {
  const currentYear = new Date().getFullYear();
  const todayStr = new Date().toISOString().split('T')[0];

  // 0. Pola wymagane
  if (!formData.brand || !formData.brand.trim()) {
    return 'Marka pojazdu jest wymagana.';
  }
  if (!formData.model || !formData.model.trim()) {
    return 'Model pojazdu jest wymagany.';
  }

  // 1. Rocznik (1887 - aktualny rok)
  const year = Number(formData.year);
  if (!Number.isInteger(year) || year < 1887 || year > currentYear) {
    return `Rocznik musi być liczbą całkowitą z przedziału od 1887 do ${currentYear}.`;
  }

  // 2. Cena (100 - 10 000 000 PLN)
  const price = Number(formData.price);
  if (isNaN(price) || price < 100 || price > 10000000) {
    return 'Cena pojazdu musi wynosić od 100 PLN do 10 000 000 PLN.';
  }

  // 3. Numer VIN (dokładnie 17 dozwolonych znaków, jeśli podany)
  if (formData.vin) {
    const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
    if (!vinRegex.test(formData.vin)) {
      return `Numer VIN musi składać się z dokładnie 17 znaków (litery A-Z bez I, O, Q oraz cyfry). Obecnie: ${formData.vin.length}/17.`;
    }
  }

  // 4. Numer rejestracyjny (max 8 znaków alfanumerycznych)
  if (formData.licensePlate) {
    const plateRegex = /^[A-Z0-9]{1,8}$/;
    if (!plateRegex.test(formData.licensePlate)) {
      return 'Numer rejestracyjny może zawierać tylko litery i cyfry (maksymalnie 8 znaków bez spacji).';
    }
  }

  // 5. Data pierwszej rejestracji (nie starsza niż rocznik, nie młodsza niż dzisiaj)
  if (formData.firstRegistration) {
    const minDateStr = `${year}-01-01`;
    if (formData.firstRegistration < minDateStr) {
      return `Data pierwszej rejestracji (${formData.firstRegistration}) nie może być wcześniejsza niż rocznik produkcji pojazdu (${year}).`;
    }
    if (formData.firstRegistration > todayStr) {
      return 'Data pierwszej rejestracji nie może być datą z przyszłości.';
    }
  }

  // 6. Przebieg, Pojemność, Moc
  if (formData.mileage !== '' && (Number(formData.mileage) < 0 || Number(formData.mileage) > 10000000)) {
    return 'Podaj prawidłowy przebieg pojazdu.';
  }
  if (formData.engineCapacity !== '' && (Number(formData.engineCapacity) < 1 || Number(formData.engineCapacity) > 20000)) {
    return 'Pojemność skokowa musi mieścić się w przedziale 1 - 20 000 cm³.';
  }
  if (formData.enginePower !== '' && (Number(formData.enginePower) < 1 || Number(formData.enginePower) > 3000)) {
    return 'Moc silnika musi mieścić się w przedziale 1 - 3000 kW.';
  }

  // 7. Kraj pochodzenia przy imporcie
  if (formData.isImported && (!formData.importedFrom || !formData.importedFrom.trim())) {
    return 'Podaj kraj pochodzenia dla importowanego pojazdu.';
  }

  // 8. Liczba drzwi (1 - 9)
  if (formData.doors !== '' && formData.doors !== null) {
    const doors = Number(formData.doors);
    if (!Number.isInteger(doors) || doors < 1 || doors > 9) {
      return 'Liczba drzwi musi mieścić się w zakresie od 1 do 9.';
    }
  }

  // 9. Liczba miejsc (1 - 100)
  if (formData.seats !== '' && formData.seats !== null) {
    const seats = Number(formData.seats);
    if (!Number.isInteger(seats) || seats < 1 || seats > 100) {
      return 'Liczba miejsc musi mieścić się w zakresie od 1 do 100.';
    }
  }

  return null;
};