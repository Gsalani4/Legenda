import React, { useEffect, useState } from 'react';
import { ArrowLeft, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { getUsers } from '../services/adminUsersApi';
import { useToast } from '../hooks/use-toast';

const AdminUsersPage = () => {
  const { toast } = useToast();
  const [token] = useState(() => localStorage.getItem('admin_token'));
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await getUsers(token);
      setUsers(res.users || []);
    } catch (e) {
      toast({ title: 'Hata', description: 'Kullanıcılar alınamadı.', variant: 'destructive' });
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
              Geri
            </Button>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-[#FF7A00]" />
              Kullanıcılar
            </h1>
          </div>
          <Badge className="bg-[#FF7A00] text-black">{users.length}</Badge>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-gray-400">Yükleniyor...</div>
        ) : users.length === 0 ? (
          <div className="text-gray-400">Kullanıcı bulunamadı.</div>
        ) : (
          <div className="grid gap-4">
            {users.map((u) => (
              <Card key={u.id} className="bg-[#111111] border-gray-800 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <button
                      type="button"
                      className="text-left hover:text-[#FF7A00] transition-colors"
                      onClick={() => (window.location.href = `/admin/users/${u.id}`)}
                    >
                      {u.first_name} {u.last_name}
                    </button>
                    <Badge className="bg-black border border-gray-700 text-white">{u.listing_count} ilan</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-300 space-y-1">
                  <div><span className="text-gray-400">Telefon:</span> {u.phone}</div>
                  {u.email && <div><span className="text-gray-400">E-posta:</span> {u.email}</div>}
                  <div><span className="text-gray-400">Kayıt:</span> {u.created_at ? new Date(u.created_at).toLocaleString() : '-'}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
