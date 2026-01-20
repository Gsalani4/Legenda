import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Eye, LogOut, X, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import ChunkedImageUploader from '../components/ChunkedImageUploader';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const AdminPanel = () => {
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [listings, setListings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [formData, setFormData] = useState({
    listing_type: 'rental',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    price_type: 'daily',
    mileage: 0,
    fuel_type: 'Benzin',
    transmission: 'Otomatik',
    images: [],
    description: '',
    features: [],
    contact_phone: '+995 500 88 30 88',
    contact_email: 'info@legendacar.ge'
  });
  // URL-based image add removed; use device upload instead
  // URL-based image state removed (device upload only)
  const [featureInput, setFeatureInput] = useState('');

  const loadListings = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/listings?status=active`);
      setListings(response.data.listings || []);
    } catch (error) {
      console.error('Error loading listings:', error);
    }
  }, []);

  const verifyToken = useCallback(async (savedToken) => {
    try {
      await axios.get(`${API_URL}/admin/verify`, {
        headers: { Authorization: `Bearer ${savedToken}` }
      });
      setIsLoggedIn(true);
      await loadListings();
    } catch (error) {
      localStorage.removeItem('admin_token');
      setToken(null);
    }
  }, [loadListings]);

  // (duplicate removed) loadListings


  // (removed stray duplicate block)


  // Auto-login on refresh removed to satisfy repo ESLint rule (setState in effect).
  // User can login again if page refreshed.
  // useEffect(() => {
  //   if (token) {
  //     verifyToken(token);
  //   }
  // }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/admin/login`, {
        username,
        password
      });
      
      if (response.data.success) {
        const newToken = response.data.access_token;
        setToken(newToken);
        localStorage.setItem('admin_token', newToken);
        setIsLoggedIn(true);
        await loadListings();
        toast({
          title: 'Başarılı!',
          description: 'Admin paneline hoş geldiniz.'
        });
      }
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Kullanıcı adı veya şifre yanlış.',
        variant: 'destructive'
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  // (duplicate removed) loadListings

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingListing) {
        await axios.put(
          `${API_URL}/listings/${editingListing.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast({ title: 'Başarılı!', description: 'İlan güncellendi.' });
      } else {
        await axios.post(
          `${API_URL}/listings`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast({ title: 'Başarılı!', description: 'İlan oluşturuldu.' });
      }
      
      resetForm();
      loadListings();
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'İşlem başarısız oldu.',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu ilanı silmek istediğinizden emin misiniz?')) return;
    
    try {
      await axios.delete(`${API_URL}/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast({ title: 'Başarılı!', description: 'İlan silindi.' });
      loadListings();
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Silme işlemi başarısız.',
        variant: 'destructive'
      });
    }
  };

  const startEdit = (listing) => {
    setEditingListing(listing);
    setFormData({
      listing_type: listing.listing_type,
      brand: listing.brand,
      model: listing.model,
      year: listing.year,
      price: listing.price,
      price_type: listing.price_type,
      mileage: listing.mileage,
      fuel_type: listing.fuel_type,
      transmission: listing.transmission,
      images: listing.images || [],
      description: listing.description,
      features: listing.features || [],
      contact_phone: listing.contact_phone,
      contact_email: listing.contact_email
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      listing_type: 'rental',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      price: 0,
      price_type: 'daily',
      mileage: 0,
      fuel_type: 'Benzin',
      transmission: 'Otomatik',
      images: [],
      description: '',
      features: [],
      contact_phone: '+995 500 88 30 88',
      contact_email: 'info@legendacar.ge'
    });
    setEditingListing(null);
    setShowForm(false);
    
    setFeatureInput('');
  };

  const setImages = (images) => {
    setFormData(prev => ({
      ...prev,
      images
    }));
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0B0B]">
        <Card className="w-full max-w-md bg-[#111111] border-gray-800 text-white">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Admin Girişi</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label>Kullanıcı Adı</Label>
                <Input
                  className="bg-black border-gray-700 text-white"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Şifre</Label>
                <Input
                  className="bg-black border-gray-700 text-white"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-[#FF7A00] hover:bg-[#ff8c1a]">
                Giriş Yap
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B]">
      <div className="bg-black border-b border-gray-800 text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">LEGENDACAR Admin</h1>
          <Button variant="ghost" onClick={handleLogout} className="text-white hover:bg-[#111111]">
            <LogOut className="w-4 h-4 mr-2" />
            Çıkış Yap
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 text-white">
        {!showForm ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">İlanlar ({listings.length})</h2>
              <div className="flex gap-2">
                <Button onClick={() => window.location.href = '/admin/settings'} variant="outline" className="bg-black text-white border-gray-700 hover:bg-[#111111]">
                  <Settings className="w-4 h-4 mr-2" />
                  Site Ayarları
                </Button>
                <Button onClick={() => setShowForm(true)} className="bg-[#FF7A00] hover:bg-[#ff8c1a]">
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni İlan Ekle
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {listings.map(listing => (
                <Card key={listing.id} className="bg-[#111111] border-gray-800 text-white">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <div className="w-32 h-32 bg-black border border-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                        {listing.images && listing.images[0] ? (
                          <img src={listing.images[0]} alt={listing.brand} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-bold">{listing.brand} {listing.model}</h3>
                            <p className="text-gray-400">{listing.year} • {listing.mileage.toLocaleString()} km</p>
                          </div>
                          <Badge className={listing.listing_type === 'rental' ? 'bg-green-600' : 'bg-[#FF7A00]'}>
                            {listing.listing_type === 'rental' ? 'Kiralık' : 'Satılık'}
                          </Badge>
                        </div>
                        
                        <p className="text-2xl font-bold text-[#FF7A00] mb-3">
                          ₾{listing.price}{listing.listing_type === 'rental' ? '/gün' : ''}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                          <span>{listing.fuel_type}</span>
                          <span>•</span>
                          <span>{listing.transmission}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {listing.views}
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button onClick={() => startEdit(listing)} variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            Düzenle
                          </Button>
                          <Button onClick={() => handleDelete(listing.id)} variant="destructive" size="sm">
                            <Trash2 className="w-4 h-4 mr-1" />
                            Sil
                          </Button>
                          <Button onClick={() => window.open(`/car/${listing.id}`, '_blank')} variant="ghost" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Görüntüle
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="bg-[#111111] border-gray-800 text-white">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{editingListing ? 'İlan Düzenle' : 'Yeni İlan Ekle'}</CardTitle>
                <Button variant="ghost" onClick={resetForm}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>İlan Tipi</Label>
                    <Select value={formData.listing_type} onValueChange={(val) => setFormData({...formData, listing_type: val})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rental">Kiralık</SelectItem>
                        <SelectItem value="sale">Satılık</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Marka</Label>
                    <Input className="bg-black border-gray-700 text-white" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} required />
                  </div>

                  <div className="space-y-2">
                    <Label>Model</Label>
                    <Input value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} required />
                  </div>

                  <div className="space-y-2">
                    <Label>Yıl</Label>
                    <Input type="number" value={formData.year} onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})} required />
                  </div>

                  <div className="space-y-2">
                    <Label>Fiyat (₾)</Label>
                    <Input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})} required />
                  </div>

                  <div className="space-y-2">
                    <Label>Fiyat Tipi</Label>
                    <Select value={formData.price_type} onValueChange={(val) => setFormData({...formData, price_type: val})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Günlük</SelectItem>
                        <SelectItem value="monthly">Aylık</SelectItem>
                        <SelectItem value="total">Toplam</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Kilometre</Label>
                    <Input type="number" value={formData.mileage} onChange={(e) => setFormData({...formData, mileage: parseInt(e.target.value)})} required />
                  </div>

                  <div className="space-y-2">
                    <Label>Yakıt Tipi</Label>
                    <Select value={formData.fuel_type} onValueChange={(val) => setFormData({...formData, fuel_type: val})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Benzin">Benzin</SelectItem>
                        <SelectItem value="Dizel">Dizel</SelectItem>
                        <SelectItem value="Elektrik">Elektrik</SelectItem>
                        <SelectItem value="Hibrit">Hibrit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Vites</Label>
                    <Select value={formData.transmission} onValueChange={(val) => setFormData({...formData, transmission: val})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Otomatik">Otomatik</SelectItem>
                        <SelectItem value="Manuel">Manuel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <ChunkedImageUploader
                  value={formData.images}
                  onChange={setImages}
                  disabled={false}
                />

                <div className="space-y-2">
                  <Label>Açıklama</Label>
                  <Textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Özellikler</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Özellik ekle (ör: Klima, GPS)"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <Button type="button" onClick={addFeature}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {formData.features.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.features.map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="gap-1">
                          {feature}
                          <button type="button" onClick={() => removeFeature(idx)}>
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>İletişim Telefonu</Label>
                    <Input value={formData.contact_phone} onChange={(e) => setFormData({...formData, contact_phone: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>İletişim E-posta</Label>
                    <Input type="email" value={formData.contact_email} onChange={(e) => setFormData({...formData, contact_email: e.target.value})} />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="bg-[#FF7A00] hover:bg-[#ff8c1a]">
                    {editingListing ? 'Güncelle' : 'Oluştur'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    İptal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;