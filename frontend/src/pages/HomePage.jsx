import React, { useState, useEffect, useCallback } from 'react';
import { Car, Fuel, Gauge, Settings, Phone, Mail, Eye, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { BRANDS, BRANDS_MODELS } from '../data/brandsModels';
import { useLanguage } from '../context/LanguageContext';
import { translateFuelType, translateTransmission, translateModelText } from '../utils/translations';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const HomePage = () => {
  const { t, currentLanguage } = useLanguage();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'rental', 'sale'

  const [filterForm, setFilterForm] = useState({
    brand: '',
    model: '',
    min_year: '',
    max_year: '',
    fuel_type: ''
  });
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [filtersOpenMobile, setFiltersOpenMobile] = useState(false);

  const loadListings = useCallback(async (filtersOverride = null) => {
    try {
      setLoading(true);
      const paramsObj = {};
      if (filter !== 'all') paramsObj.listing_type = filter;

      const f = filtersOverride || appliedFilters;
      if (f) {
        if (f.brand) paramsObj.brand = f.brand;
        if (f.model) paramsObj.model = f.model;
        if (f.min_year) paramsObj.min_year = f.min_year;
        if (f.max_year) paramsObj.max_year = f.max_year;
        if (f.fuel_type) paramsObj.fuel_type = f.fuel_type;
      }

      const response = await axios.get(`${API_URL}/listings`, { params: paramsObj });
      setListings(response.data.listings || []);
    } catch (error) {
      console.error('Error loading listings:', error);
    } finally {
      setLoading(false);
    }
  }, [filter, appliedFilters]);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  const matchesAppliedFilters = (listing) => {
    const f = appliedFilters;
    if (!f) return true;

    if (f.brand && listing.brand !== f.brand) return false;
    if (f.model && listing.model !== f.model) return false;
    if (f.fuel_type && listing.fuel_type !== f.fuel_type) return false;

    const year = Number(listing.year);
    if (f.min_year && !Number.isNaN(year) && year < Number(f.min_year)) return false;
    if (f.max_year && !Number.isNaN(year) && year > Number(f.max_year)) return false;

    return true;
  };

  const vipListings = listings
    .filter((l) => l.is_vip)
    .sort((a, b) => {
      const ar = a.vip_rank ?? 999999;
      const br = b.vip_rank ?? 999999;
      return ar - br;
    })
    .filter(matchesAppliedFilters);

  const normalListings = listings.filter((l) => !l.is_vip && matchesAppliedFilters(l));
  const filteredVipListings = vipListings;

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

      {/* Filters Bar */}
      <div className="bg-black border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          {/* Mobile toggle */}
          <div className="flex sm:hidden items-center justify-between">
            <Button
              type="button"
              variant="outline"
              className="bg-black text-white border-gray-700 hover:bg-[#111111]"
              onClick={() => setFiltersOpenMobile((v) => !v)}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filtre
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${filtersOpenMobile ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const payload = {
                brand: filterForm.brand,
                model: filterForm.model,
                min_year: filterForm.min_year,
                max_year: filterForm.max_year,
                fuel_type: filterForm.fuel_type
              };
              setAppliedFilters(payload);
              loadListings(payload);
            }}
            className="flex flex-col lg:flex-row lg:items-end gap-3"
          >
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 w-full ${filtersOpenMobile ? 'block' : 'hidden'} sm:grid`}>
              <div className="space-y-2">
                <div className="text-sm text-gray-300">Marka</div>
                <Select value={filterForm.brand} onValueChange={(val) => setFilterForm({ ...filterForm, brand: val, model: '' })}>
                  <SelectTrigger className="bg-[#111111] border-gray-700 text-white">
                    <SelectValue placeholder="Marka" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRANDS.map((b) => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-gray-300">Model</div>
                <Select value={filterForm.model} onValueChange={(val) => setFilterForm({ ...filterForm, model: val })}>
                  <SelectTrigger className="bg-[#111111] border-gray-700 text-white">
                    <SelectValue placeholder="Model" />
                  </SelectTrigger>
                  <SelectContent>
                    {(filterForm.brand ? (BRANDS_MODELS[filterForm.brand] || []) : []).map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-gray-300">Yıl (min)</div>
                <input
                  className="h-10 rounded-md bg-[#111111] border border-gray-700 px-3 text-white text-sm"
                  value={filterForm.min_year}
                  onChange={(e) => setFilterForm({ ...filterForm, min_year: e.target.value })}
                  placeholder="2010"
                />
              </div>

              <div className="space-y-2">
                <div className="text-sm text-gray-300">Yıl (max)</div>
                <input
                  className="h-10 rounded-md bg-[#111111] border border-gray-700 px-3 text-white text-sm"
                  value={filterForm.max_year}
                  onChange={(e) => setFilterForm({ ...filterForm, max_year: e.target.value })}
                  placeholder="2024"
                />
              </div>

              <div className="space-y-2">
                <div className="text-sm text-gray-300">Yakıt</div>
                <Select value={filterForm.fuel_type} onValueChange={(val) => setFilterForm({ ...filterForm, fuel_type: val })}>
                  <SelectTrigger className="bg-[#111111] border-gray-700 text-white">
                    <SelectValue placeholder="Yakıt" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Benzin">Benzin</SelectItem>
                    <SelectItem value="Dizel">Dizel</SelectItem>
                    <SelectItem value="Elektrik">Elektrik</SelectItem>
                    <SelectItem value="Hibrit">Hibrit</SelectItem>
                    <SelectItem value="Plug-in Hybrid">Plug-in Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className={`flex gap-2 ${filtersOpenMobile ? 'flex' : 'hidden'} sm:flex`}>
              <Button type="submit" className="bg-[#FF7A00] hover:bg-[#ff8c1a]">Uygula</Button>
              <Button
                type="button"
                variant="outline"
                className="bg-black text-white border-gray-700 hover:bg-[#111111]"
                onClick={() => {
                  const cleared = { brand: '', model: '', min_year: '', max_year: '', fuel_type: '' };
                  setFilterForm(cleared);
                  setAppliedFilters(null);
                  loadListings(null);
                }}
              >
                Temizle
              </Button>
            </div>
          </form>
        </div>
      </div>


      {/* VIP Listings */}
      {filteredVipListings.length > 0 && (
        <div className="container mx-auto px-4 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVipListings.map((listing) => (
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