import React, { useEffect, useState } from 'react';
import { ArrowLeft, Users, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { getUsers } from '../services/adminUsersApi';
import { useToast } from '../hooks/use-toast';
import { useLanguage } from '../context/LanguageContext';

const AdminUsersPage = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [token] = useState(() => localStorage.getItem('admin_token'));
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await getUsers(token);
      const list = res.users || [];
      setUsers(list);
      setFilteredUsers(list);
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
              {t.common.back}
            </Button>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-[#FF7A00]" />
              {t.adminUsers.title}
            </h1>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const search = q.trim().toLowerCase();
              if (!search) {
                setFilteredUsers(users);
                return;
              }
              setFilteredUsers(
                users.filter((u) => {
                  const hay = `${u.first_name || ''} ${u.last_name || ''} ${u.phone || ''} ${u.email || ''}`.toLowerCase();
                  return hay.includes(search);
                })
              );
            }}
            className="flex items-center gap-2"
          >
            <input
              className="h-10 w-[260px] rounded-md bg-[#111111] border border-gray-700 px-3 text-white text-sm"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
            />
            <Button type="submit" className="bg-[#FF7A00] hover:bg-[#ff8c1a]">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Badge className="bg-[#FF7A00] text-black">{filteredUsers.length}</Badge>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-gray-400">{t.common.loading}</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-gray-400">-</div>
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
                    <Badge className="bg-black border border-gray-700 text-white">
                      {u.listing_count} {t.adminUsers.listings}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-300 space-y-1">
                  <div><span className="text-gray-400">{t.adminUsers.phone}:</span> {u.phone}</div>
                  {u.email && <div><span className="text-gray-400">{t.adminUsers.email}:</span> {u.email}</div>}
                  <div><span className="text-gray-400">{t.adminUsers.registered}:</span> {u.created_at ? new Date(u.created_at).toLocaleString() : '-'}</div>
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
