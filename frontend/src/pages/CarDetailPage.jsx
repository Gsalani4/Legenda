import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Car, Fuel, Gauge, Settings, Phone, Mail, Calendar, Eye, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const CarDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadListing();
  }, [id]);

  const loadListing = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/listings/${id}`);
      setListing(response.data.listing);
    } catch (error) {
      console.error('Error loading listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (listing?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
    }
  };

  const prevImage = () => {
    if (listing?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">
            {currentLanguage === 'ka' && 'განცხადება ვერ მოიძებნა.'}
            {currentLanguage === 'en' && 'Listing not found.'}
            {currentLanguage === 'ru' && 'Объявление не найдено.'}
            {currentLanguage === 'tr' && 'İlan bulunamadı.'}
            {currentLanguage === 'az' && 'Elan tapılmadı.'}
          </p>
          <Button onClick={() => navigate('/')}>
            {currentLanguage === 'ka' && 'მთავარზე დაბრუნება'}
            {currentLanguage === 'en' && 'Back to Home'}
            {currentLanguage === 'ru' && 'Вернуться на главную'}
            {currentLanguage === 'tr' && 'Ana Sayfaya Dön'}
            {currentLanguage === 'az' && 'Ana Səhifəyə Qayıt'}
          </Button>
        </div>
      </div>
    );
  }

  const getPriceText = () => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {currentLanguage === 'ka' && 'უკან'}
          {currentLanguage === 'en' && 'Back'}
          {currentLanguage === 'ru' && 'Назад'}
          {currentLanguage === 'tr' && 'Geri Dön'}
          {currentLanguage === 'az' && 'Geri'}
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="relative h-96 bg-gray-200">
                  {listing.images && listing.images.length > 0 ? (
                    <>
                      <img
                        src={listing.images[currentImageIndex]}
                        alt={`${listing.brand} ${listing.model}`}
                        className="w-full h-full object-cover"
                      />
                      
                      {listing.images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                          >
                            <ChevronRight className="w-6 h-6" />
                          </button>
                          
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                            {currentImageIndex + 1} / {listing.images.length}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car className="w-24 h-24 text-gray-400" />
                    </div>
                  )}
                  
                  <Badge className={`absolute top-4 left-4 ${listing.listing_type === 'rental' ? 'bg-green-600' : 'bg-blue-600'}`}>
                    {listing.listing_type === 'rental' ? 'Kiralık' : 'Satılık'}
                  </Badge>
                </div>
                
                {/* Thumbnail Images */}
                {listing.images && listing.images.length > 1 && (
                  <div className="p-4 flex gap-2 overflow-x-auto">
                    {listing.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                          idx === currentImageIndex ? 'border-blue-600' : 'border-transparent'
                        }`}
                        onClick={() => setCurrentImageIndex(idx)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Details */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl">{listing.brand} {listing.model}</CardTitle>
                    <p className="text-gray-500 mt-2">{listing.year} Model</p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Eye className="w-4 h-4" />
                    <span>{listing.views} görüntülenme</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Technical Specs */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Teknik Özellikler</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Gauge className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Kilometre</p>
                        <p className="font-semibold">{listing.mileage.toLocaleString()} km</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Fuel className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Yakıt</p>
                        <p className="font-semibold">{listing.fuel_type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Settings className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Vites</p>
                        <p className="font-semibold">{listing.transmission}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Yıl</p>
                        <p className="font-semibold">{listing.year}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Açıklama</h3>
                  <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
                </div>

                {/* Features */}
                {listing.features && listing.features.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Özellikler</h3>
                    <div className="flex flex-wrap gap-2">
                      {listing.features.map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-sm">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Contact & Price */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-6">
                {/* Price */}
                <div>
                  <p className="text-sm text-gray-500 mb-2">Fiyat</p>
                  <p className="text-4xl font-bold text-blue-600">{getPriceText()}</p>
                </div>

                {/* Contact Info */}
                <div className="border-t pt-6 space-y-4">
                  <h3 className="font-semibold text-lg">İletişim Bilgileri</h3>
                  
                  <a 
                    href={`tel:${listing.contact_phone}`}
                    className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div className="bg-blue-600 text-white p-2 rounded-full">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Telefon</p>
                      <p className="font-semibold">{listing.contact_phone}</p>
                    </div>
                  </a>

                  <a 
                    href={`mailto:${listing.contact_email}`}
                    className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div className="bg-blue-600 text-white p-2 rounded-full">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">E-posta</p>
                      <p className="font-semibold text-sm">{listing.contact_email}</p>
                    </div>
                  </a>

                  <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
                    <Phone className="w-4 h-4 mr-2" />
                    Hemen Ara
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailPage;