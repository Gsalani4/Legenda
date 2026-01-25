import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../hooks/use-toast';
import { useLanguage } from '../context/LanguageContext';
import { adminLogin, userLogin, userRegister } from '../services/authApi';

const AuthPage = () => {
  const { toast } = useToast();
  const { t } = useLanguage();

  const getInitialTab = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') === 'signup' ? 'signup' : 'signin';
  };

  const [tab, setTab] = useState(getInitialTab());
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const [signingIn, setSigningIn] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pw1, setPw1] = useState('');
  const [pw2, setPw2] = useState('');

  const passwordsMatch = useMemo(() => pw1 && pw2 && pw1 === pw2, [pw1, pw2]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setSigningIn(true);
    try {
      // 1) Try user login first (email or phone)
      const userRes = await userLogin({ identifier, password });
      if (userRes?.success) {
        localStorage.setItem('user_token', userRes.access_token);
        localStorage.removeItem('admin_token');
        window.location.href = '/user';
        return;
      }
    } catch (e1) {
      // ignore and fallback to admin
    }

    try {
      // 2) Fallback to admin login (username)
      const adminRes = await adminLogin({ username: identifier, password });
      if (adminRes?.success) {
        localStorage.setItem('admin_token', adminRes.access_token);
        localStorage.removeItem('user_token');
        window.location.href = '/admin';
        return;
      }
      toast({ title: t.common.error, description: t.auth.invalidCredentials, variant: 'destructive' });
    } catch (e2) {
      toast({ title: t.common.error, description: t.auth.invalidCredentials, variant: 'destructive' });
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!passwordsMatch) {
      toast({ title: t.auth.errorTitle, description: t.auth.passwordMismatch, variant: 'destructive' });
      return;
    }

    try {
      await userRegister({ firstName, lastName, phone, email, password: pw1 });
      const loginRes = await userLogin({ identifier: email || phone, password: pw1 });
      if (loginRes.success) {
        localStorage.setItem('user_token', loginRes.access_token);
        localStorage.removeItem('admin_token');
        window.location.href = '/user';
      } else {
        setTab('signin');
      }
    } catch (err) {
      const msg = err?.response?.data?.detail || t.auth.registerFailed;
      toast({ title: t.auth.errorTitle, description: msg, variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-[#111111] border-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-2xl text-center">{tab === 'signup' ? t.auth.signUp : t.auth.signIn}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-black border border-gray-800">
              <TabsTrigger value="signin" className="data-[state=active]:bg-[#FF7A00] data-[state=active]:text-white">{t.auth.signIn}</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-[#FF7A00] data-[state=active]:text-white">{t.auth.signUp}</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label>{t.auth.identifier}</Label>
                  <Input
                    className="bg-black border-gray-700 text-white"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.auth.password}</Label>
                  <Input
                    className="bg-black border-gray-700 text-white"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-[#FF7A00] hover:bg-[#ff8c1a]" disabled={signingIn}>
                  {t.auth.signIn}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>{t.auth.firstName}</Label>
                    <Input className="bg-black border-gray-700 text-white" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.auth.lastName}</Label>
                    <Input className="bg-black border-gray-700 text-white" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t.auth.phone}</Label>
                  <Input className="bg-black border-gray-700 text-white" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label>{t.auth.emailOptional}</Label>
                  <Input className="bg-black border-gray-700 text-white" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>{t.auth.password}</Label>
                  <Input className="bg-black border-gray-700 text-white" type="password" value={pw1} onChange={(e) => setPw1(e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label>{t.auth.confirmPassword}</Label>
                  <Input className="bg-black border-gray-700 text-white" type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} required />
                  {pw1 && pw2 && (
                    <div className={passwordsMatch ? 'text-xs text-green-500' : 'text-xs text-red-500'}>
                      {passwordsMatch ? t.auth.passwordsMatch : t.auth.passwordMismatch}
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full bg-[#FF7A00] hover:bg-[#ff8c1a]" disabled={!passwordsMatch}>
                  {t.auth.signUp}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
