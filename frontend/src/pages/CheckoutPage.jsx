import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { addons } from '../mockData';
import { useToast } from '../hooks/use-toast';
import { useLanguage } from '../context/LanguageContext';

const CheckoutPage = () => {
  const { toast } = useToast();
  const { t, getAddonTranslation, getLocationTranslation } = useLanguage();
  const [cart, setCart] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: '',
    pickupTime: '',
    dropoffDate: '',
    dropoffTime: '',
    vehicleType: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    paymentMethod: 'card'
  });

  useEffect(() => {
    const savedCart = localStorage.getItem('rentalCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddonToggle = (addon) => {
    setSelectedAddons(prev => {
      const exists = prev.find(a => a.id === addon.id);
      if (exists) {
        return prev.filter(a => a.id !== addon.id);
      } else {
        return [...prev, { ...addon, quantity: 1 }];
      }
    });
  };

  const calculateTotal = () => {
    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.days), 0);
    const addonsTotal = selectedAddons.reduce((sum, addon) => sum + (addon.price * (cart[0]?.days || 1)), 0);
    return cartTotal + addonsTotal;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.pickupLocation || !formData.dropoffLocation || !formData.pickupDate || !formData.dropoffDate) {
      toast({
        title: t.checkout.errorTitle,
        description: t.checkout.errorMessage,
        variant: 'destructive'
      });
      return;
    }

    const booking = {
      ...formData,
      cart,
      addons: selectedAddons,
      total: calculateTotal(),
      bookingDate: new Date().toISOString()
    };

    localStorage.setItem('lastBooking', JSON.stringify(booking));
    
    toast({
      title: t.checkout.successTitle,
      description: t.checkout.successMessage,
    });

    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  };

  const locations = [1, 2, 3, 4];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <nav className="text-sm text-gray-500 mb-2">
          <a href="/" className="hover:text-blue-600">{t.checkout.breadcrumb}</a>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-900">{t.checkout.title}</span>
        </nav>
        <h1 className="text-3xl font-bold text-gray-900">{t.checkout.title}</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                {t.checkout.reservation}
              </CardTitle>
              <CardDescription>{t.checkout.reservationDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    {t.checkout.pickupLocation}
                  </Label>
                  <Select value={formData.pickupLocation} onValueChange={(val) => handleInputChange('pickupLocation', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t.checkout.selectLocation} />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map(locId => {
                        const loc = getLocationTranslation(locId);
                        return <SelectItem key={locId} value={locId.toString()}>{loc.name}</SelectItem>;
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    {t.checkout.dropoffLocation}
                  </Label>
                  <Select value={formData.dropoffLocation} onValueChange={(val) => handleInputChange('dropoffLocation', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t.checkout.selectLocation} />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map(locId => {
                        const loc = getLocationTranslation(locId);
                        return <SelectItem key={locId} value={locId.toString()}>{loc.name}</SelectItem>;
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t.checkout.pickupDate}</Label>
                  <Input type="date" value={formData.pickupDate} onChange={(e) => handleInputChange('pickupDate', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    {t.checkout.time}
                  </Label>
                  <Input type="time" value={formData.pickupTime} onChange={(e) => handleInputChange('pickupTime', e.target.value)} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t.checkout.dropoffDate}</Label>
                  <Input type="date" value={formData.dropoffDate} onChange={(e) => handleInputChange('dropoffDate', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    {t.checkout.time}
                  </Label>
                  <Input type="time" value={formData.dropoffTime} onChange={(e) => handleInputChange('dropoffTime', e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t.checkout.addons}</CardTitle>
              <CardDescription>{t.checkout.addonsDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {addons.map(addon => {
                  const addonTrans = getAddonTranslation(addon.id);
                  return (
                    <div key={addon.id} className="flex items-start gap-3 p-4 border rounded-lg hover:border-blue-500 transition-colors cursor-pointer" onClick={() => handleAddonToggle(addon)}>
                      <Checkbox checked={selectedAddons.some(a => a.id === addon.id)} onCheckedChange={() => handleAddonToggle(addon)} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{addonTrans.name}</h4>
                          <div className="text-right">
                            {addon.onSale && (
                              <span className="text-xs text-gray-400 line-through block">₾{addon.originalPrice}</span>
                            )}
                            <span className="font-bold text-blue-600">₾{addon.price}{t.checkout.perDay}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{addonTrans.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t.checkout.yourInfo}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t.checkout.firstName}</Label>
                  <Input placeholder={t.checkout.firstName} value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t.checkout.lastName}</Label>
                  <Input placeholder={t.checkout.lastName} value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t.checkout.email}</Label>
                <Input type="email" placeholder="example@mail.com" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{t.checkout.phone}</Label>
                <Input placeholder="+995 5XX XX XX XX" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t.checkout.paymentMethod}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-blue-500 transition-colors" onClick={() => handleInputChange('paymentMethod', 'card')}>
                  <Checkbox checked={formData.paymentMethod === 'card'} />
                  <div>
                    <p className="font-medium">{t.checkout.creditCard}</p>
                    <p className="text-xs text-gray-500">{t.checkout.creditCardDesc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-blue-500 transition-colors" onClick={() => handleInputChange('paymentMethod', 'cash')}>
                  <Checkbox checked={formData.paymentMethod === 'cash'} />
                  <div>
                    <p className="font-medium">{t.checkout.cash}</p>
                    <p className="text-xs text-gray-500">{t.checkout.cashDesc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-blue-500 transition-colors" onClick={() => handleInputChange('paymentMethod', 'transfer')}>
                  <Checkbox checked={formData.paymentMethod === 'transfer'} />
                  <div>
                    <p className="font-medium">{t.checkout.bankTransfer}</p>
                    <p className="text-xs text-gray-500">{t.checkout.bankTransferDesc}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                {t.checkout.summary}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 && selectedAddons.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">{t.checkout.emptyCart}</p>
                  <Button className="mt-4" onClick={() => window.location.href = '/vehicles'}>
                    {t.checkout.selectVehicle}
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {cart.map((item, index) => (
                      <div key={index} className="flex justify-between items-start pb-3 border-b">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.days} {t.checkout.days} × ₾{item.price}</p>
                        </div>
                        <p className="font-bold">₾{item.price * item.days}</p>
                      </div>
                    ))}
                    {selectedAddons.map((addon) => {
                      const addonTrans = getAddonTranslation(addon.id);
                      return (
                        <div key={addon.id} className="flex justify-between items-start pb-3 border-b">
                          <div>
                            <p className="font-medium text-sm">{addonTrans.name}</p>
                            <p className="text-xs text-gray-500">{cart[0]?.days || 1} {t.checkout.days} × ₾{addon.price}</p>
                          </div>
                          <p className="font-bold">₾{addon.price * (cart[0]?.days || 1)}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold">{t.checkout.total}:</span>
                      <span className="text-2xl font-bold text-blue-600">₾{calculateTotal()}</span>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg" onClick={handleSubmit}>
                      {t.checkout.bookNow}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">{t.checkout.newInStore}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {addons.slice(0, 3).map(addon => {
                  const addonTrans = getAddonTranslation(addon.id);
                  return (
                    <div key={addon.id} className="flex gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-2xl">🛡️</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{addonTrans.name}</p>
                        <p className="text-blue-600 font-bold text-sm">₾{addon.price}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;