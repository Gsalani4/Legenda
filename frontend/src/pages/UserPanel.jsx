import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import { useLanguage } from '../context/LanguageContext';
import ChunkedImageUploader from '../components/ChunkedImageUploader';
import { getMyListings, createMyListing, updateMyListing, deleteMyListing } from '../services/userListingsApi';

const UserPanel = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [token, setToken] = useState(() => localStorage.getItem('user_token'));
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [featureInput, setFeatureInput] = useState('');
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
    contact_phone: '',
    contact_email: ''
  });

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await getMyListings(token);
      setListings(res.listings || []);
    } catch (e) {
      localStorage.removeItem('user_token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [token]);

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
      contact_phone: '',
      contact_email: ''
    });
    setFeatureInput('');
    setEditingListing(null);
    setShowForm(false);
  };

  const setImages = (images) => setFormData(prev => ({ ...prev, images }));

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({ ...prev, features: [...prev.features, featureInput.trim()] }));
      setFeatureInput('');
    }
  };

  const removeFeature = (idx) => {
    setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }));
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
      contact_phone: listing.contact_phone || '',
      contact_email: listing.contact_email || ''
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingListing) {
        await updateMyListing(token, editingListing.id, formData);
        toast({ title: t.common.success, description: t.user.listingUpdatedPending });
      } else {
        await createMyListing(token, formData);
        toast({ title: t.common.success, description: t.user.listingSubmitted });
      }
      await load();
      resetForm();
    } catch (err) {
      toast({ title: t.common.error, description: t.common.operationFailed, variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('İlan silinsin mi?')) return;
    try {
      await deleteMyListing(token, id);
      toast({ title: 'Silindi', description: 'İlan silindi.' });
      await load();
    } catch (e) {
      toast({ title: 'Hata', description: 'Silinemedi.', variant: 'destructive' });
    }
  };

  const logout = () => {
    localStorage.removeItem('user_token');
    setToken(null);
    window.location.href = '/admin';
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] text-white flex items-center justify-center">
        <div className="text-gray-300">Lütfen giriş yapın.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      <div className="bg-black border-b border-gray-800 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Kullanıcı Paneli</h1>
          <Button variant="ghost" onClick={logout} className="text-white hover:bg-[#111111]">
            <LogOut className="w-4 h-4 mr-2" />
            Çıkış
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {!showForm ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">İlanlarım ({listings.length})</h2>
              <Button onClick={() => setShowForm(true)} className="bg-[#FF7A00] hover:bg-[#ff8c1a]">
                <Plus className="w-4 h-4 mr-2" />
                İlan Ekle
              </Button>
            </div>

            {loading ? (
              <div className="text-gray-400">Yükleniyor...</div>
            ) : (
              <div className="grid gap-4">
                {listings.map((l) => (
                  <Card key={l.id} className="bg-[#111111] border-gray-800 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-lg font-bold">{l.brand} {l.model}</div>
                          <div className="text-sm text-gray-400">{l.year} • {l.mileage.toLocaleString()} km</div>
                          <div className="mt-2">
                            <Badge className={l.status === 'active' ? 'bg-green-600' : l.status === 'pending' ? 'bg-yellow-600' : 'bg-red-600'}>
                              {l.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="bg-black text-white border-gray-700 hover:bg-[#111111]" onClick={() => startEdit(l)}>
                            <Edit className="w-4 h-4 mr-1" />
                            Düzenle
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(l.id)}>
                            <Trash2 className="w-4 h-4 mr-1" />
                            Sil
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          <Card className="bg-[#111111] border-gray-800 text-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{editingListing ? 'İlan Düzenle' : 'Yeni İlan Ekle'}</CardTitle>
                <Button variant="ghost" onClick={resetForm} className="text-white hover:bg-[#111111]">
                  X
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>İlan Tipi</Label>
                    <Select value={formData.listing_type} onValueChange={(val) => setFormData({ ...formData, listing_type: val })}>
                      <SelectTrigger className="bg-black border-gray-700">
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
                    <Input className="bg-black border-gray-700 text-white" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} required />
                  </div>

                  <div className="space-y-2">
                    <Label>Model</Label>
                    <Input className="bg-black border-gray-700 text-white" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} required />
                  </div>

                  <div className="space-y-2">
                    <Label>Yıl</Label>
                    <Input className="bg-black border-gray-700 text-white" type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })} required />
                  </div>

                  <div className="space-y-2">
                    <Label>Fiyat (₾)</Label>
                    <Input className="bg-black border-gray-700 text-white" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} required />
                  </div>

                  <div className="space-y-2">
                    <Label>Fiyat Tipi</Label>
                    <Select value={formData.price_type} onValueChange={(val) => setFormData({ ...formData, price_type: val })}>
                      <SelectTrigger className="bg-black border-gray-700">
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
                    <Input className="bg-black border-gray-700 text-white" type="number" value={formData.mileage} onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) })} required />
                  </div>

                  <div className="space-y-2">
                    <Label>Yakıt</Label>
                    <Select value={formData.fuel_type} onValueChange={(val) => setFormData({ ...formData, fuel_type: val })}>
                      <SelectTrigger className="bg-black border-gray-700">
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
                    <Select value={formData.transmission} onValueChange={(val) => setFormData({ ...formData, transmission: val })}>
                      <SelectTrigger className="bg-black border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Otomatik">Otomatik</SelectItem>
                        <SelectItem value="Manuel">Manuel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <ChunkedImageUploader value={formData.images} onChange={setImages} disabled={false} />

                <div className="space-y-2">
                  <Label>Açıklama</Label>
                  <Textarea className="bg-black border-gray-700 text-white" rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                </div>

                <div className="space-y-2">
                  <Label>Özellikler</Label>
                  <div className="flex gap-2">
                    <Input className="bg-black border-gray-700 text-white" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())} placeholder="Özellik ekle" />
                    <Button type="button" onClick={addFeature} className="bg-[#FF7A00] hover:bg-[#ff8c1a]">+
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.features.map((f, idx) => (
                      <Badge key={idx} variant="outline" className="gap-1 bg-black border-gray-700 text-white">
                        {f}
                        <button type="button" onClick={() => removeFeature(idx)} className="text-gray-300">x</button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>İletişim Telefon</Label>
                    <Input className="bg-black border-gray-700 text-white" value={formData.contact_phone} onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>İletişim E-posta</Label>
                    <Input className="bg-black border-gray-700 text-white" type="email" value={formData.contact_email} onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })} />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="bg-[#FF7A00] hover:bg-[#ff8c1a]">Kaydet</Button>
                  <Button type="button" variant="outline" className="bg-black text-white border-gray-700 hover:bg-[#111111]" onClick={resetForm}>İptal</Button>
                </div>

                <p className="text-xs text-gray-400">Not: İlanınız admin onayından sonra yayına alınır.</p>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserPanel;
