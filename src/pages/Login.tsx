import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { LanguageSelector } from '@/components/LanguageSelector';
import { login, initializeDemoData } from '@/services/storage.service';
import { Cake } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};
    
    if (!email) {
      newErrors.email = t('login.emailRequired') || 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = t('login.invalidEmail') || 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = t('login.passwordRequired') || 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = t('login.passwordMinLength') || 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    initializeDemoData();
    const success = login(email, password);
    if (success) {
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } else {
      toast.error(t('login.invalidCredentials'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{background: 'linear-gradient(135deg, #137fec 0%, #0a5dc7 100%)'}}>
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
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardContent className="pt-8 pb-8 px-8">
            {/* Logo */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex justify-center mb-6"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg" style={{background: '#137fec'}}>
                <Cake className="h-8 w-8 text-white" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-center mb-4"
            >
              <h1 className="text-2xl font-bold text-gray-800 mb-1">{t('login.title')}</h1>
              <p className="text-gray-600 text-sm">{t('login.subtitle')}</p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-3 mb-4">
              <div className="space-y-1">
                <Label htmlFor="email" className="text-gray-700 text-sm">{t('login.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('login.emailPlaceholder')}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({...errors, email: undefined});
                  }}
                  className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="password" className="text-gray-700 text-sm">{t('login.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t('login.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({...errors, password: undefined});
                  }}
                  className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                  required
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full text-white font-semibold h-10 text-base shadow-lg hover:shadow-xl transition-shadow"
                style={{background: '#137fec'}}
              >
                {t('login.loginButton')}
              </Button>
            </form>

            {/* Register Link */}
            <div className="text-center mb-3">
              <p className="text-sm text-gray-600">
                {t('login.noAccount')}{' '}
                <Link to="/register" className="font-semibold hover:underline" style={{color: '#137fec'}}>
                  {t('login.registerLink')}
                </Link>
              </p>
            </div>

            {/* Language Selector */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="pt-3 border-t border-gray-200"
            >
              <p className="text-sm text-gray-600 mb-1 text-center">{t('common.selectLanguage')}</p>
              <div className="flex justify-center">
                <LanguageSelector />
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
