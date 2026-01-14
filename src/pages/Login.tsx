import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { LanguageSelector } from '@/components/LanguageSelector';
import { login, initializeDemoData } from '@/services/storage.service';
import { Cake, Sparkles, Users, Image } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    initializeDemoData();
    const success = login(email, password);
    if (success) {
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } else {
      toast.error(t('login.invalidCredentials'));
    }
  };

  const features = [
    { icon: Users, text: 'Manage Karyakartas' },
    { icon: Cake, text: 'Auto Birthday Detection' },
    { icon: Image, text: 'Dynamic Banners' },
  ];

  return (
    <div className="min-h-screen gradient-saffron flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="shadow-xl border-0 bg-card/95 backdrop-blur">
          <CardContent className="pt-8 pb-8 px-8">
            {/* Logo */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex justify-center mb-6"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-saffron shadow-lg">
                <Cake className="h-8 w-8 text-primary-foreground" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-center mb-8"
            >
              <h1 className="text-2xl font-bold text-foreground mb-2">{t('login.title')}</h1>
              <p className="text-muted-foreground">{t('login.subtitle')}</p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4 mb-8">
              <div className="space-y-2">
                <Label htmlFor="email">{t('login.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="demo@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('login.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full gradient-saffron text-primary-foreground font-semibold h-12 text-base gap-2 shadow-lg hover:shadow-xl transition-shadow"
              >
                <Sparkles className="h-5 w-5" />
                {t('login.loginButton')}
              </Button>
            </form>

            {/* Features */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-3 gap-4 mb-8"
            >
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="text-xs text-center text-muted-foreground">{feature.text}</span>
                  </div>
                );
              })}
            </motion.div>

            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground">
                {t('login.noAccount')}{' '}
                <Link to="/register" className="text-primary font-semibold hover:underline">
                  {t('login.registerLink')}
                </Link>
              </p>
            </div>

            {/* Language Selector */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="pt-6 border-t border-muted"
            >
              <p className="text-sm text-muted-foreground mb-2 text-center">{t('common.selectLanguage')}</p>
              <div className="flex justify-center">
                <LanguageSelector />
              </div>
            </motion.div>

            <p className="text-xs text-center text-muted-foreground mt-4">
              {t('login.demoNote')}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
