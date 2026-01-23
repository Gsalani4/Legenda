import React, { useEffect, useState } from 'react';
import { ArrowLeft, KeyRound, Trash2, Archive } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import { getUserDetail, updateUserDetail, resetUserPassword, getUserListingsAdmin, archiveListingAdmin, deleteListingAdmin, setListingExpiryAdmin } from '../services/adminUserDetailApi';

const AdminUserDetailPage = () => {
  const { toast } = useToast();
  const [token] = useState(() => localStorage.getItem('admin_token'));
  const userId = window.location.pathname.split('/').pop();

  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [allowedDays, setAllowedDays] = useState([1, 5, 7, 10, 15, 20, 30]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newPassword, setNewPassword] = useState(null);

  const [form, setForm] = useState({ first_name: '', last_name: '', phone: '', email: '' });

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const u = await getUserDetail(token, userId);
      setUser(u.user);
      setForm({
        first_name: u.user.first_name || '',
        last_name: u.user.last_name || '',
        phone: u.user.phone || '',
        email: u.user.email || ''
      });

      const l = await getUserListingsAdmin(token, userId);
      setListings(l.listings || []);
      setAllowedDays(l.allowed_expiry_days || [1, 5, 7, 10, 15, 20, 30]);
    } catch (e) {
      toast({ title: 'Hata', description: 'Kullanıcı detayı alınamadı.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      window.location.href = '/admin';
      return;
    }
    load();
    // eslint-disable-next-line
  }, []);

  const saveUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserDetail(token, userId, form);
      toast({ title: 'Kaydedildi', description: 'Kullanıcı bilgileri güncellendi.' });
      await load();
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Güncellenemedi';
      toast({ title: 'Hata', description: msg, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const resetPw = async () => {
    try {
      const res = await resetUserPassword(token, userId);
      setNewPassword(res.new_password);
      toast({ title: 'Yeni şifre üretildi', description: 'Aşağıda görebilirsiniz.' });
    } catch {
      toast({ title: 'Hata', description: 'Şifre değiştirilemedi.', variant: 'destructive' });
    }
  };

  const doArchive = async (listingId) => {
    if (!window.confirm('İlan arşive alınsın mı?')) return;
    await archiveListingAdmin(token, listingId);
    toast({ title: 'Arşivlendi', description: 'İlan arşive alındı.' });
    await load();
  };

  const doDelete = async (listingId) => {
    if (!window.confirm('İlan silinsin mi?')) return;
    await deleteListingAdmin(token, listingId);
    toast({ title: 'Silindi', description: 'İlan silindi.' });
    await load();
  };

  const setExpiry = async (listingId, days) => {
    await setListingExpiryAdmin(token, listingId, Number(days));
    toast({ title: 'Güncellendi', description: `Aktif süre: ${days} gün` });
    await load();
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0B0B0B] text-gray-300 flex items-center justify-center">Yükleniyor...</div>;
  }

  if (!user) {
    return <div className="min-h-screen bg-[#0B0B0B] text-gray-300 flex items-center justify-center">Kullanıcı bulunamadı.</div>;
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      <div className="bg-black border-b border-gray-800 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Button variant="ghost" className="text-white hover:bg-[#111111]" onClick={() => (window.location.href = '/admin/users')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri
          </Button>
          <div className="text-right">
            <div className="text-xl font-bold">{user.first_name} {user.last_name}</div>
            <div className="text-sm text-gray-400">{user.phone}{user.email ? ` • ${user.email}` : ''}</div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid lg:grid-cols-2 gap-6">
        <Card className="bg-[#111111] border-gray-800 text-white">
          <CardHeader>
            <CardTitle>Kullanıcı Bilgileri</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Ad</Label>
                  <Input className="bg-black border-gray-700 text-white" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Soyad</Label>
                  <Input className="bg-black border-gray-700 text-white" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Telefon</Label>
                <Input className="bg-black border-gray-700 text-white" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              </div>

              <div className="space-y-2">
                <Label>E-posta</Label>
                <Input className="bg-black border-gray-700 text-white" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>

              <Button type="submit" className="bg-[#FF7A00] hover:bg-[#ff8c1a]" disabled={saving}>
                Kaydet
              </Button>
            </form>

            <div className="mt-6 border-t border-gray-800 pt-4">
              <Button type="button" variant="outline" className="bg-black text-white border-gray-700 hover:bg-[#111111]" onClick={resetPw}>
                <KeyRound className="w-4 h-4 mr-2" />
                Şifre Sıfırla (Rastgele)
              </Button>

              {newPassword && (
                <div className="mt-3 text-sm">
                  <div className="text-gray-400">Yeni şifre:</div>
                  <div className="mt-1 font-mono bg-black border border-gray-800 rounded px-3 py-2 inline-block">
                    {newPassword}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-gray-800 text-white">
          <CardHeader>
            <CardTitle>Kullanıcının İlanları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {listings.length === 0 ? (
              <div className="text-gray-400">İlan yok.</div>
            ) : (
              listings.map((l) => (
                <div key={l.id} className="flex items-center justify-between gap-3 p-4 bg-black border border-gray-800 rounded">
                  <div>
                    <div className="font-semibold">{l.brand} {l.model}</div>
                    <div className="text-xs text-gray-400">
                      {l.status} • {l.created_at ? new Date(l.created_at).toLocaleString() : ''}
                      {l.expires_at ? ` • Exp: ${new Date(l.expires_at).toLocaleDateString()}` : ''}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Select onValueChange={(val) => setExpiry(l.id, val)}>
                      <SelectTrigger className="w-[120px] bg-black border-gray-700 text-white">
                        <SelectValue placeholder="Süre" />
                      </SelectTrigger>
                      <SelectContent>
                        {allowedDays.map((d) => (
                          <SelectItem key={d} value={String(d)}>{d} gün</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button variant="outline" className="bg-black text-white border-gray-700 hover:bg-[#111111]" onClick={() => doArchive(l.id)}>
                      <Archive className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" onClick={() => doDelete(l.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminUserDetailPage;
