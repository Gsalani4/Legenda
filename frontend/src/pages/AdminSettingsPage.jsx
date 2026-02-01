import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';
import { useSettings } from '../context/SettingsContext';
import SingleImageUploader from '../components/SingleImageUploader';
import { useNavigate } from 'react-router-dom';

const AdminSettingsPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { settings, updateSettings, refreshSettings } = useSettings();
  const [formData, setFormData] = useState({
    contact: {
      phone: '',
      email: '',
      address: '',
      working_hours: ''
    },
    social_media: {
      facebook: '',
      instagram: '',
      whatsapp: ''
    },
    banner: {
      desktop_image_url: '',
      mobile_image_url: ''
    }
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin');
      return;
    }
    
    setFormData(settings);
  }, [settings, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const success = await updateSettings(formData);
      
      if (success) {
        toast({
          title: 'Başarılı!',
          description: 'Site ayarları güncellendi.'
        });
        await refreshSettings();
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Ayarlar güncellenemedi.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      <div className="bg-black border-b border-gray-800 text-white py-4">
        <div className="container mx-auto px-4 flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/admin')} className="text-white hover:bg-[#111111]">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold">Site Ayarları</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
          {/* İletişim Bilgileri */}
          <Card className="bg-[#111111] border-gray-800 text-white">
            <CardHeader>
              <CardTitle>İletişim Bilgileri</CardTitle>
              <CardDescription className="text-gray-400">Üst banner ve footer&apos;da görünecek iletişim bilgileri</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Telefon</Label>
                <Input
                  className="bg-black border-gray-700 text-white"
                  value={formData.contact.phone}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact: { ...formData.contact, phone: e.target.value }
                  })}
                  placeholder="+995 500 88 30 88"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>E-posta</Label>
                <Input
                  className="bg-black border-gray-700 text-white"
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact: { ...formData.contact, email: e.target.value }
                  })}
                  placeholder="info@legendacar.ge"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Adres</Label>
                <Input
                  className="bg-black border-gray-700 text-white"
                  value={formData.contact.address}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact: { ...formData.contact, address: e.target.value }
                  })}
                  placeholder="თამაზ გამყრელიძის 19"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Çalışma Saatleri</Label>
                <Input
                  className="bg-black border-gray-700 text-white"
                  value={formData.contact.working_hours}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact: { ...formData.contact, working_hours: e.target.value }
                  })}
                  placeholder="ორშ - შაბ 8.00 - 18.00"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Sosyal Medya */}
          <Card className="bg-[#111111] border-gray-800 text-white">
            <CardHeader>
              <CardTitle>Sosyal Medya</CardTitle>
              <CardDescription className="text-gray-400">Footer&apos;da görünecek sosyal medya linkleri</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Facebook URL</Label>
                <Input
                  className="bg-black border-gray-700 text-white"
                  type="url"
                  value={formData.social_media.facebook}
                  onChange={(e) => setFormData({
                    ...formData,
                    social_media: { ...formData.social_media, facebook: e.target.value }
                  })}
                  placeholder="https://www.facebook.com/..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Instagram URL</Label>
                <Input
                  className="bg-black border-gray-700 text-white"
                  type="url"
                  value={formData.social_media.instagram}
                  onChange={(e) => setFormData({
                    ...formData,
                    social_media: { ...formData.social_media, instagram: e.target.value }
                  })}
                  placeholder="https://www.instagram.com/..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>WhatsApp URL</Label>
                <Input
                  className="bg-black border-gray-700 text-white"
                  type="url"
                  value={formData.social_media.whatsapp}
                  onChange={(e) => setFormData({
                    ...formData,
                    social_media: { ...formData.social_media, whatsapp: e.target.value }
                  })}
                  placeholder="https://wa.me/..."
                  required
                />
                <p className="text-xs text-gray-400">Örnek: https://wa.me/995598123456</p>
              </div>
            </CardContent>
          </Card>


          {/* Üst Banner */}
          <Card className="bg-[#111111] border-gray-800 text-white">
            <CardHeader>
              <CardTitle>Üst Banner</CardTitle>
              <CardDescription className="text-gray-400">
                Header ile içerik arasındaki alana görsel koyabilirsiniz. Görsel yoksa alan tamamen kapanır.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Masaüstü Görseli (1680x150)</Label>
                <SingleImageUploader
                  value={formData.banner?.desktop_image_url}
                  onChange={(url) => setFormData({
                    ...formData,
                    banner: { ...formData.banner, desktop_image_url: url }
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label>Mobil Görsel (80x60)</Label>
                <SingleImageUploader
                  value={formData.banner?.mobile_image_url}
                  onChange={(url) => setFormData({
                    ...formData,
                    banner: { ...formData.banner, mobile_image_url: url }
                  })}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <style>{`.bg-[#111111] [data-description]{color:#9ca3af}`}</style>
            <Button type="submit" className="bg-[#FF7A00] hover:bg-[#ff8c1a]" disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/admin')}>
              İptal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettingsPage;