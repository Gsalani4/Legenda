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

  const [filters, setFilters] = useState({
    min_price: '',
    max_price: '',
    min_year: '',
    max_year: '',
    min_mileage: '',
    max_mileage: '',
    fuel_type: '',
    transmission: ''
  });
  const [appliedFilters, setAppliedFilters] = useState(null);

  useEffect(() => {
    loadListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, appliedFilters]);

  const loadListings = async () => {
    try {
      setLoading(true);
      const paramsObj = {};
      if (filter !== 'all') paramsObj.listing_type = filter;
      if (appliedFilters) {
        Object.entries(appliedFilters).forEach(([k, v]) => {
          if (v !== '' && v != null) paramsObj[k] = v;
        });
      }
      const response = await axios.get(`${API_URL}/listings`, { params: paramsObj });
      setListings(response.data.listings || []);
    } catch (error) {
      console.error('Error loading listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const vipListings = listings
    .filter((l) => l.is_vip)
    .sort((a, b) => {
      const ar = a.vip_rank ?? 999999;
      const br = b.vip_rank ?? 999999;
      return ar - br;
    });
  const normalListings = listings.filter((l) => !l.is_vip);

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
      {/* Hero Section (Option A: dark + orange accent) */}
      <div className="bg-black border-b border-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="h-1 w-14 bg-[#FF7A00] mb-4" />
          <h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-wide">
            LEGENDACAR
          </h1>
          <p className="text-base md:text-lg mb-1 text-gray-200">
            {currentLanguage === 'ka' && 'ავტომობილების დაქირავება და გაყიდვა საქართველოში'}
            {currentLanguage === 'en' && 'Car Rental and Sales in Georgia'}
            {currentLanguage === 'ru' && 'Аренда и продажа автомобилей в Грузии'}
            {currentLanguage === 'tr' && 'Gürcistan\'da Araç Kiralama ve Satış'}
            {currentLanguage === 'az' && 'Gürcüstanda Avtomobil İcarəsi və Satışı'}
          </p>
          <p className="text-sm md:text-base text-gray-300">
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

      {/* Advanced Filters */}
      <div className="bg-black border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setAppliedFilters({
                min_price: filters.min_price,
                max_price: filters.max_price,
                min_year: filters.min_year,
                max_year: filters.max_year,
                min_mileage: filters.min_mileage,
                max_mileage: filters.max_mileage,
                fuel_type: filters.fuel_type,
                transmission: filters.transmission
              });
            }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3"
          >
            <input className="h-10 rounded-md bg-[#111111] border border-gray-700 px-3 text-white text-sm" placeholder="Min ₾" value={filters.min_price} onChange={(e) => setFilters({ ...filters, min_price: e.target.value })} />
            <input className="h-10 rounded-md bg-[#111111] border border-gray-700 px-3 text-white text-sm" placeholder="Max ₾" value={filters.max_price} onChange={(e) => setFilters({ ...filters, max_price: e.target.value })} />
            <input className="h-10 rounded-md bg-[#111111] border border-gray-700 px-3 text-white text-sm" placeholder="Min year" value={filters.min_year} onChange={(e) => setFilters({ ...filters, min_year: e.target.value })} />
            <input className="h-10 rounded-md bg-[#111111] border border-gray-700 px-3 text-white text-sm" placeholder="Max year" value={filters.max_year} onChange={(e) => setFilters({ ...filters, max_year: e.target.value })} />
            <input className="h-10 rounded-md bg-[#111111] border border-gray-700 px-3 text-white text-sm" placeholder="Min km" value={filters.min_mileage} onChange={(e) => setFilters({ ...filters, min_mileage: e.target.value })} />
            <input className="h-10 rounded-md bg-[#111111] border border-gray-700 px-3 text-white text-sm" placeholder="Max km" value={filters.max_mileage} onChange={(e) => setFilters({ ...filters, max_mileage: e.target.value })} />

            <select className="h-10 rounded-md bg-[#111111] border border-gray-700 px-3 text-white text-sm" value={filters.fuel_type} onChange={(e) => setFilters({ ...filters, fuel_type: e.target.value })}>
              <option value="">Fuel</option>
              <option value="Benzin">Benzin</option>
              <option value="Dizel">Dizel</option>
              <option value="Elektrik">Elektrik</option>
              <option value="Hibrit">Hibrit</option>
            </select>

            <select className="h-10 rounded-md bg-[#111111] border border-gray-700 px-3 text-white text-sm" value={filters.transmission} onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}>
              <option value="">Vites</option>
              <option value="Otomatik">Otomatik</option>
              <option value="Manuel">Manuel</option>
            </select>

            <div className="col-span-2 md:col-span-4 lg:col-span-8 flex gap-2">
              <Button type="submit" className="bg-[#FF7A00] hover:bg-[#ff8c1a]">Uygula</Button>
              <Button
                type="button"
                variant="outline"
                className="bg-black text-white border-gray-700 hover:bg-[#111111]"
                onClick={() => {
                  setFilters({ min_price: '', max_price: '', min_year: '', max_year: '', min_mileage: '', max_mileage: '', fuel_type: '', transmission: '' });
                  setAppliedFilters(null);
                }}
              >
                Temizle
              </Button>
            </div>
          </form>
        </div>
      </div>


      {/* VIP Banner */}
      {vipListings.length > 0 && (
        <div className="container mx-auto px-4 pt-8">
          <div className="bg-[#111111] border border-[#D4AF37]/40 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded bg-[#D4AF37] text-black font-bold tracking-wide">
                VİP
              </div>
              <div className="text-white font-semibold">VİP İlanlar</div>
            </div>
            <div className="text-sm text-gray-300">{vipListings.length}</div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vipListings.map((listing) => (
              <Card key={`vip-${listing.id}`} className="overflow-hidden bg-[#111111] border-[#D4AF37]/50 hover:border-[#D4AF37] transition-all duration-300 cursor-pointer" onClick={() => window.location.href = `/car/${listing.id}`}>
                <div className="relative h-48 bg-black">
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

                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-[#FF7A00] text-white">
                      {getListingTypeText(listing.listing_type)}
                    </Badge>
                    <Badge className="bg-[#D4AF37] text-black font-bold">VİP</Badge>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded flex items-center gap-1 text-sm">
                    <Eye className="w-4 h-4 text-[#FF7A00]" />
                    {listing.views}
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {listing.brand} {listing.model}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">{listing.year} {translateModelText(currentLanguage)}</p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Gauge className="w-4 h-4 text-[#FF7A00]" />
                      {listing.mileage.toLocaleString()} km
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Fuel className="w-4 h-4 text-[#FF7A00]" />
                      {translateFuelType(listing.fuel_type, currentLanguage)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Settings className="w-4 h-4 text-[#FF7A00]" />
                      {translateTransmission(listing.transmission, currentLanguage)}
                    </div>
                  </div>
                  <div className="border-t border-gray-800 pt-3">
                    <p className="text-2xl font-bold text-white">{getPriceText(listing)}</p>
                  </div>
                </CardContent>

                <CardFooter className="bg-black border-t border-gray-800 p-4">
                  <Button className="w-full bg-[#D4AF37] hover:bg-[#e2c14e] text-black font-semibold">
                    {currentLanguage === 'ka' && 'დეტალები'}
                    {currentLanguage === 'en' && 'View Details'}
                    {currentLanguage === 'ru' && 'Подробнее'}
                    {currentLanguage === 'tr' && 'Detaylar'}
                    {currentLanguage === 'az' && 'Ətraflı'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Listings Grid */}
      <div className="container mx-auto px-4 py-8">
        {normalListings.length === 0 ? (
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
            {normalListings.map(listing => (
              <Card key={listing.id} className="overflow-hidden bg-[#111111] border-gray-800 hover:border-[#FF7A00] transition-all duration-300 cursor-pointer" onClick={() => window.location.href = `/car/${listing.id}`}>
                {/* Image */}
                <div className="relative h-48 bg-black">
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
                    className="absolute top-3 left-3 bg-[#FF7A00] text-white"
                  >
                    {getListingTypeText(listing.listing_type)}
                  </Badge>
                  
                  {/* Views */}
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded flex items-center gap-1 text-sm">
                    <Eye className="w-4 h-4 text-[#FF7A00]" />
                    {listing.views}
                  </div>
                </div>

                <CardContent className="p-4">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-2">
                    {listing.brand} {listing.model}
                  </h3>
                  
                  {/* Year */}
                  <p className="text-gray-400 text-sm mb-3">{listing.year} {translateModelText(currentLanguage)}</p>
                  
                  {/* Features */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Gauge className="w-4 h-4 text-[#FF7A00]" />
                      {listing.mileage.toLocaleString()} km
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Fuel className="w-4 h-4 text-[#FF7A00]" />
                      {translateFuelType(listing.fuel_type, currentLanguage)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Settings className="w-4 h-4 text-[#FF7A00]" />
                      {translateTransmission(listing.transmission, currentLanguage)}
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="border-t border-gray-800 pt-3">
                    <p className="text-2xl font-bold text-white">
                      {getPriceText(listing)}
                    </p>
                  </div>
                </CardContent>

                <CardFooter className="bg-black border-t border-gray-800 p-4">
                  <Button className="w-full bg-[#FF7A00] hover:bg-[#ff8c1a] text-white">
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