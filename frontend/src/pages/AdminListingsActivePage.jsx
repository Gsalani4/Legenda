import React, { useEffect, useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import { useLanguage } from '../context/LanguageContext';
import { getAdminListings, setAdminListingStatus } from '../services/adminListingsApi';
import { setVipAdmin } from '../services/adminVipApi';

const ALLOWED_DAYS = [1, 5, 7, 10, 15, 20, 30];

const AdminListingsActivePage = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [token] = useState(() => localStorage.getItem('admin_token'));

  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [vipDays, setVipDays] = useState({});
  const [vipRank, setVipRank] = useState({});

  const load = async (search = '') => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await getAdminListings(token, { status: 'active', q: search });
      setListings(res.listings || []);
    } catch (e) {
      toast({ title: t.common.error, description: t.common.operationFailed, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      window.location.href = '/admin';
      return;
    }
    load('');
    // eslint-disable-next-line
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    setQuery(q);
    load(q);
  };

  const archive = async (id) => {
    await setAdminListingStatus(token, id, { status: 'archived' });
    toast({ title: t.common.success, description: t.adminUserDetail.archived });
    load(query);
  };

  const setVip = async (id) => {
    const days = Number(vipDays[id] || 0);
    const rank = vipRank[id] === '' || vipRank[id] == null ? null : Number(vipRank[id]);
    if (!ALLOWED_DAYS.includes(days)) {
      toast({ title: t.common.error, description: t.adminUserDetail.expiry, variant: 'destructive' });
      return;
    }
    await setVipAdmin(token, id, { enable: true, days, rank });
    toast({ title: t.common.success, description: 'VIP' });
    load(query);
  };

  const clearVip = async (id) => {
    await setVipAdmin(token, id, { enable: false });
    toast({ title: t.common.success, description: 'VIP removed' });
    load(query);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      <div className="bg-black border-b border-gray-800 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-white hover:bg-[#111111]" onClick={() => (window.location.href = '/admin')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.common.back}
            </Button>
            <h1 className="text-2xl font-bold">{t.status.active}</h1>
            <Badge className="bg-[#FF7A00] text-black">{listings.length}</Badge>
          </div>

          <form onSubmit={onSearch} className="flex items-center gap-2">
            <Input
              className="w-[280px] bg-[#111111] border-gray-700 text-white"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
            />
            <Button type="submit" className="bg-[#FF7A00] hover:bg-[#ff8c1a]">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-gray-400">{t.common.loading}</div>
        ) : listings.length === 0 ? (
          <div className="text-gray-400">-</div>
        ) : (
          <div className="grid gap-4">
            {listings.map((l) => (
              <Card key={l.id} className="bg-[#111111] border-gray-800 text-white">
                <CardContent className="p-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold">{l.brand} {l.model}</div>
                    <div className="text-xs text-gray-400">
                      {l.created_at ? new Date(l.created_at).toLocaleString() : ''}
                      {l.expires_at ? ` • Exp: ${new Date(l.expires_at).toLocaleDateString()}` : ''}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" className="bg-black text-white border-gray-700 hover:bg-[#111111]" onClick={() => window.open(`/car/${l.id}`, '_blank')}>
                      View
                    </Button>

                    <Select value={String(vipDays[l.id] || '')} onValueChange={(val) => setVipDays((p) => ({ ...p, [l.id]: val }))}>
                      <SelectTrigger className="w-[120px] bg-black border-gray-700 text-white">
                        <SelectValue placeholder="VIP days" />
                      </SelectTrigger>
                      <SelectContent>
                        {ALLOWED_DAYS.map((d) => (
                          <SelectItem key={d} value={String(d)}>{d} {t.common.days}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <input
                      className="h-10 w-[90px] rounded-md bg-black border border-gray-700 px-3 text-white text-sm"
                      value={vipRank[l.id] ?? ''}
                      onChange={(e) => setVipRank((p) => ({ ...p, [l.id]: e.target.value }))}
                      placeholder="Rank"
                    />

                    <Button variant="outline" className="bg-black text-white border-gray-700 hover:bg-[#111111]" onClick={() => setVip(l.id)}>
                      VIP
                    </Button>

                    {l.is_vip && (
                      <Button variant="outline" className="bg-black text-white border-gray-700 hover:bg-[#111111]" onClick={() => clearVip(l.id)}>
                        VIP Off
                      </Button>
                    )}

                    <Button variant="outline" className="bg-black text-white border-gray-700 hover:bg-[#111111]" onClick={() => archive(l.id)}>
                      Archive
                    </Button>
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

export default AdminListingsActivePage;
