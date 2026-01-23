import React, { useEffect, useState } from 'react';
import { Check, X, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useLanguage } from '../context/LanguageContext';
import { getPendingListings, approveListing, rejectListing } from '../services/adminApprovalsApi';

const PendingListingsPage = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [token] = useState(() => localStorage.getItem('admin_token'));

  useEffect(() => {
    if (!token) {
      window.location.href = '/admin';
    }
  }, [token]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await getPendingListings(token);
      setListings(res.listings || []);
    } catch (e) {
      toast({ title: t.common.error, description: t.admin.pendingLoadError, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  const doApprove = async (id, days) => {
    await approveListing(token, id, days);
    toast({ title: t.common.success, description: t.admin.pendingApproved });
    await load();
  };

  const doReject = async (id) => {
    await rejectListing(token, id);
    toast({ title: t.common.success, description: t.admin.pendingRejected });
    await load();
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      <div className="bg-black border-b border-gray-800 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-white hover:bg-[#111111]"
              onClick={() => (window.location.href = '/admin')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.common.back}
            </Button>
            <h1 className="text-2xl font-bold">{t.admin.pendingListings}</h1>
          </div>
          <Badge className="bg-yellow-600 text-black">{listings.length}</Badge>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-gray-400">{t.common.loading}</div>
        ) : listings.length === 0 ? (
          <div className="text-gray-400">{t.admin.noPending}</div>
        ) : (
          <div className="grid gap-4">
            {listings.map((l) => (
              <Card key={l.id} className="bg-[#111111] border-gray-800 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{l.brand} {l.model}</span>
                    <span className="text-sm text-gray-400">{new Date(l.created_at).toLocaleString()}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-sm text-gray-300">
                      <div>Fiyat: ₾{l.price}</div>
                      <div>Yıl: {l.year}</div>
                      <div>Yakıt: {l.fuel_type} • Vites: {l.transmission}</div>
                      <div className="mt-2 line-clamp-2 text-gray-400">{l.description}</div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="bg-green-600 hover:bg-green-700" onClick={() => doApprove(l.id)}>
                        <Check className="w-4 h-4 mr-2" />
                        Onayla
                      </Button>
                      <Button variant="destructive" onClick={() => doReject(l.id)}>
                        <X className="w-4 h-4 mr-2" />
                        Reddet
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingListingsPage;
