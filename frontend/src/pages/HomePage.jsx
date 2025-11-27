import React, { useState, useEffect } from 'react';
import { Car, Fuel, Gauge, Settings, Phone, Mail, Eye } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useLanguage } from '../context/LanguageContext';
import { translateFuelType, translateTransmission, translateModelText } from '../utils/translations';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const HomePage = () => {
  const { t, currentLanguage } = useLanguage();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'rental', 'sale'

  useEffect(() => {
    loadListings();
  }, [filter]);

  const loadListings = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? `?listing_type=${filter}` : '';
      const response = await axios.get(`${API_URL}/listings${params}`);
      setListings(response.data.listings || []);
    } catch (error) {
      console.error('Error loading listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getListingTypeText = (type) => {
    const texts = {
      ka: { rental: 'ქირავდება', sale: 'იყიდება' },
      en: { rental: 'For Rent', sale: 'For Sale' },
      ru: { rental: 'Аренда', sale: 'Продажа' },
      tr: { rental: 'Kiralık', sale: 'Satılık' },
      az: { rental: 'Kirayə', sale: 'Satılır' }
    };
    return texts[currentLanguage][type] || texts['en'][type];
  };

  const getPriceText = (listing) => {
    const price = `₾${listing.price}`;
    const perDay = { ka: '/დღე', en: '/day', ru: '/день', tr: '/gün', az: '/gün' };
    const perMonth = { ka: '/თვე', en: '/month', ru: '/месяц', tr: '/ay', az: '/ay' };
    
    if (listing.listing_type === 'rental') {
      return listing.price_type === 'daily' 
        ? `${price}${perDay[currentLanguage] || perDay['en']}` 
        : `${price}${perMonth[currentLanguage] || perMonth['en']}`;
    }
    return price;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#FF7A00] to-[#ff8c1a] text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            MGZAVROBANI
          </h1>
          <p className="text-xl md:text-2xl mb-2">
            {currentLanguage === 'ka' && 'ავტომობილების დაქირავება და გაყიდვა საქართველოში'}
            {currentLanguage === 'en' && 'Car Rental and Sales in Georgia'}
            {currentLanguage === 'ru' && 'Аренда и продажа автомобилей в Грузии'}
            {currentLanguage === 'tr' && 'Gürcistan\'da Araç Kiralama ve Satış'}
            {currentLanguage === 'az' && 'Gürcüstanda Avtomobil İcarəsi və Satışı'}
          </p>
          <p className="text-lg opacity-90">
            {currentLanguage === 'ka' && 'საუკეთესო ფასებით ხარისხიანი ავტომობილები'}
            {currentLanguage === 'en' && 'Quality Vehicles at the Best Prices'}
            {currentLanguage === 'ru' && 'Качественные автомобили по лучшим ценам'}
            {currentLanguage === 'tr' && 'En İyi Fiyatlarla Kaliteli Araçlar'}
            {currentLanguage === 'az' && 'Ən Yaxşı Qiymətlərlə Keyfiyyətli Avtomobillər'}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-black border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex gap-4 py-4">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-[#FF7A00] hover:bg-[#ff8c1a] text-white' : 'bg-black text-white border-gray-700 hover:bg-[#111111]'}
            >
              {currentLanguage === 'ka' && 'ყველა განცხადება'}
              {currentLanguage === 'en' && 'All Listings'}
              {currentLanguage === 'ru' && 'Все объявления'}
              {currentLanguage === 'tr' && 'Tüm İlanlar'}
              {currentLanguage === 'az' && 'Bütün Elanlar'}
            </Button>
            <Button
              variant={filter === 'rental' ? 'default' : 'outline'}
              onClick={() => setFilter('rental')}
              className={filter === 'rental' ? 'bg-[#FF7A00] hover:bg-[#ff8c1a] text-white' : 'bg-black text-white border-gray-700 hover:bg-[#111111]'}
            >
              {currentLanguage === 'ka' && 'ქირავდება'}
              {currentLanguage === 'en' && 'For Rent'}
              {currentLanguage === 'ru' && 'Аренда'}
              {currentLanguage === 'tr' && 'Kiralık Araçlar'}
              {currentLanguage === 'az' && 'Kirayə Avtomobilləri'}
            </Button>
            <Button
              variant={filter === 'sale' ? 'default' : 'outline'}
              onClick={() => setFilter('sale')}
              className={filter === 'sale' ? 'bg-[#FF7A00] hover:bg-[#ff8c1a] text-white' : 'bg-black text-white border-gray-700 hover:bg-[#111111]'}
            >
              {currentLanguage === 'ka' && 'იყიდება'}
              {currentLanguage === 'en' && 'For Sale'}
              {currentLanguage === 'ru' && 'Продажа'}
              {currentLanguage === 'tr' && 'Satılık Araçlar'}
              {currentLanguage === 'az' && 'Satılık Avtomobillər'}
            </Button>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="container mx-auto px-4 py-8">
        {listings.length === 0 ? (
          <div className="text-center py-16">
            <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {currentLanguage === 'ka' && 'ამჟამად აქტიური განცხადებები არ არის.'}
              {currentLanguage === 'en' && 'No active listings at the moment.'}
              {currentLanguage === 'ru' && 'В данный момент нет активных объявлений.'}
              {currentLanguage === 'tr' && 'Şu anda aktif ilan bulunmamaktadır.'}
              {currentLanguage === 'az' && 'Hal-hazırda aktiv elan yoxdur.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(listing => (
              <Card key={listing.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer" onClick={() => window.location.href = `/car/${listing.id}`}>
                {/* Image */}
                <div className="relative h-48 bg-gray-200">
                  {listing.images && listing.images[0] ? (
                    <img
                      src={listing.images[0]}
                      alt={`${listing.brand} ${listing.model}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Listing Type Badge */}
                  <Badge 
                    className={`absolute top-3 left-3 ${listing.listing_type === 'rental' ? 'bg-green-600' : 'bg-blue-600'}`}
                  >
                    {getListingTypeText(listing.listing_type)}
                  </Badge>
                  
                  {/* Views */}
                  <div className="absolute bottom-3 right-3 bg-black/50 text-white px-2 py-1 rounded flex items-center gap-1 text-sm">
                    <Eye className="w-4 h-4" />
                    {listing.views}
                  </div>
                </div>

                <CardContent className="p-4">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {listing.brand} {listing.model}
                  </h3>
                  
                  {/* Year */}
                  <p className="text-gray-500 text-sm mb-3">{listing.year} {translateModelText(currentLanguage)}</p>
                  
                  {/* Features */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Gauge className="w-4 h-4" />
                      {listing.mileage.toLocaleString()} km
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Fuel className="w-4 h-4" />
                      {translateFuelType(listing.fuel_type, currentLanguage)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Settings className="w-4 h-4" />
                      {translateTransmission(listing.transmission, currentLanguage)}
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="border-t pt-3">
                    <p className="text-2xl font-bold text-blue-600">
                      {getPriceText(listing)}
                    </p>
                  </div>
                </CardContent>

                <CardFooter className="bg-gray-50 p-4">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    {currentLanguage === 'ka' && 'დეტალები'}
                    {currentLanguage === 'en' && 'View Details'}
                    {currentLanguage === 'ru' && 'Подробнее'}
                    {currentLanguage === 'tr' && 'Detayları Gör'}
                    {currentLanguage === 'az' && 'Ətraflı'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default HomePage;