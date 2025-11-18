export const vehicles = [
  {
    id: 1,
    name: 'Toyota Camry',
    category: 'Sedan',
    price: 80,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400',
    features: ['Automatic', '5 Seats', 'AC', 'Bluetooth'],
    available: true
  },
  {
    id: 2,
    name: 'Honda CR-V',
    category: 'SUV',
    price: 120,
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400',
    features: ['Automatic', '7 Seats', 'AC', '4WD'],
    available: true
  },
  {
    id: 3,
    name: 'Mercedes E-Class',
    category: 'Premium',
    price: 200,
    image: 'https://images.unsplash.com/photo-1617531653520-bd466c8f035d?w=400',
    features: ['Automatic', '5 Seats', 'Leather', 'Premium'],
    available: true
  },
  {
    id: 4,
    name: 'Hyundai Tucson',
    category: 'SUV',
    price: 100,
    image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400',
    features: ['Automatic', '5 Seats', 'AC', 'GPS'],
    available: true
  }
];

export const addons = [
  {
    id: 1,
    name: 'დაზღვევა (Insurance)',
    nameEn: 'Super Protective Insurance',
    price: 15,
    icon: 'Shield',
    description: 'სრული დაცვის დაზღვევა',
    onSale: true,
    originalPrice: 20
  },
  {
    id: 2,
    name: 'ზარალის დაზღვევა',
    nameEn: 'Loss Damage Waiver',
    price: 12,
    icon: 'ShieldCheck',
    description: 'ზარალის შემთხვევაში დაცვა'
  },
  {
    id: 3,
    name: 'შეზღუდული შესაძლებლობების კონტროლი',
    nameEn: 'Handicap Controls',
    price: 25,
    icon: 'Accessibility',
    description: 'სპეციალური მართვის სისტემა'
  },
  {
    id: 4,
    name: 'GPS ნავიგაცია',
    nameEn: 'GPS Navigation',
    price: 8,
    icon: 'Navigation',
    description: 'თანამედროვე GPS სისტემა'
  },
  {
    id: 5,
    name: 'ბავშვის სკამი',
    nameEn: 'Child Seat',
    price: 10,
    icon: 'Baby',
    description: 'უსაფრთხო ბავშვის სკამი'
  },
  {
    id: 6,
    name: 'დამატებითი მძღოლი',
    nameEn: 'Additional Driver',
    price: 5,
    icon: 'Users',
    description: 'მეორე მძღოლის დამატება'
  }
];

export const locations = [
  { id: 1, name: 'თბილისის აეროპორტი (Tbilisi Airport)', city: 'თბილისი' },
  { id: 2, name: 'თამაზ გამყრელიძის 19 (Office)', city: 'თბილისი' },
  { id: 3, name: 'ბათუმის აეროპორტი (Batumi Airport)', city: 'ბათუმი' },
  { id: 4, name: 'ქუთაისის აეროპორტი (Kutaisi Airport)', city: 'ქუთაისი' }
];

export const languages = [
  { code: 'ka', name: 'Georgian', flag: '🇬🇪' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'uk', name: 'Ukrainian', flag: '🇺🇦' }
];