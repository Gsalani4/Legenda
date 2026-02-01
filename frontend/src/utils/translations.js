// Araç özelliklerinin çevirileri
export const vehicleTranslations = {
  // Yakıt tipleri
  fuelTypes: {
    'Benzin': {
      ka: 'ბენზინი',
      en: 'Gasoline',
      ru: 'Бензин',
      tr: 'Benzin',
      az: 'Benzin'
    },
    'Dizel': {
      ka: 'დიზელი',
      en: 'Diesel',
      ru: 'Дизель',
      tr: 'Dizel',
      az: 'Dizel'
    },
    'Elektrik': {
      ka: 'ელექტრო',
      en: 'Electric',
      ru: 'Электро',
      tr: 'Elektrik',
      az: 'Elektrik'
    },
    'Hibrit': {
      ka: 'ჰიბრიდი',
      en: 'Hybrid',
      ru: 'Гибрид',
      tr: 'Hibrit',
      az: 'Hibrid'
    },
    'Plug-in Hybrid': {
      ka: 'პლაგინ ჰიბრიდი',
      en: 'Plug-in Hybrid',
      ru: 'Подключаемый гибрид',
      tr: 'Plug-in Hibrit',
      az: 'Plug-in Hibrid'
    }
  },
  
  // Vites tipleri
  transmissionTypes: {
    'Otomatik': {
      ka: 'ავტომატიკური',
      en: 'Automatic',
      ru: 'Автомат',
      tr: 'Otomatik',
      az: 'Avtomat'
    },
    'Manuel': {
      ka: 'მექანიკური',
      en: 'Manual',
      ru: 'Механика',
      tr: 'Manuel',
      az: 'Mexaniki'
    }
  },
  
  // Diğer terimler
  terms: {
    'Model': {
      ka: 'მოდელი',
      en: 'Model',
      ru: 'Модель',
      tr: 'Model',
      az: 'Model'
    },
    'km': {
      ka: 'კმ',
      en: 'km',
      ru: 'км',
      tr: 'km',
      az: 'km'
    }
  }
};

// Yakıt tipini çevir
export const translateFuelType = (fuelType, language) => {
  if (!fuelType) return fuelType;
  const translation = vehicleTranslations.fuelTypes[fuelType];
  return translation ? translation[language] || fuelType : fuelType;
};

// Vites tipini çevir
export const translateTransmission = (transmission, language) => {
  if (!transmission) return transmission;
  const translation = vehicleTranslations.transmissionTypes[transmission];
  return translation ? translation[language] || transmission : transmission;
};

// Model kelimesini çevir
export const translateModelText = (language) => {
  return vehicleTranslations.terms['Model'][language] || 'Model';
};
