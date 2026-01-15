import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LanguageSelector } from '@/components/LanguageSelector';
import { register, initializeDemoData } from '@/services/storage.service';
import { Cake, User, Mail, Lock, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Register = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        position: '',
    });

    const [errors, setErrors] = useState<{name?: string; email?: string; password?: string; position?: string}>({});

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = () => {
        const newErrors: {name?: string; email?: string; password?: string; position?: string} = {};
        
        if (!formData.name.trim()) {
            newErrors.name = t('register.nameRequired') || 'Name is required';
        }
        
        if (!formData.email) {
            newErrors.email = t('register.emailRequired') || 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = t('register.invalidEmail') || 'Please enter a valid email';
        }
        
        if (!formData.password) {
            newErrors.password = t('register.passwordRequired') || 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = t('register.passwordMinLength') || 'Password must be at least 6 characters';
        }
        
        if (!formData.position.trim()) {
            newErrors.position = t('register.positionRequired') || 'Position is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field when user starts typing
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            initializeDemoData();
            register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                position: formData.position,
                photo: '',
                defaultLanguage: 'en',
            });

            toast.success(t('register.success'));
            navigate('/dashboard');
        } catch (error) {
            toast.error('Registration failed. Please try again.');
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
                            className="flex justify-center mb-4"
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
                            <h1 className="text-2xl font-bold text-gray-800 mb-1">{t('register.title')}</h1>
                            <p className="text-gray-600 text-sm">{t('register.subtitle')}</p>
                        </motion.div>

                        <form onSubmit={handleRegister} className="space-y-3">
                            <div className="gap-1 flex flex-col">
                                <Label htmlFor="name" className="text-gray-700 text-sm">{t('register.name')}</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder={t('register.namePlaceholder')}
                                        className={`pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                )}
                            </div>

                            <div className="gap-1 flex flex-col">
                                <Label htmlFor="email" className="text-gray-700 text-sm">{t('register.email')}</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder={t('register.emailPlaceholder')}
                                        className={`pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                )}
                            </div>

                            <div className="gap-1 flex flex-col">
                                <Label htmlFor="password" className="text-gray-700 text-sm">{t('register.password')}</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder={t('register.passwordPlaceholder')}
                                        className={`pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                                )}
                            </div>

                            <div className="gap-1 flex flex-col">
                                <Label htmlFor="position" className="text-gray-700 text-sm">{t('register.position')}</Label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="position"
                                        name="position"
                                        type="text"
                                        placeholder={t('register.positionPlaceholder')}
                                        className={`pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.position ? 'border-red-500 focus:border-red-500' : ''}`}
                                        value={formData.position}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                {errors.position && (
                                    <p className="text-red-500 text-xs mt-1">{errors.position}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full text-white font-semibold h-10 text-base shadow-lg hover:shadow-xl transition-shadow"
                                style={{background: '#137fec'}}
                            >
                                {t('register.registerButton')}
                            </Button>
                        </form>

                        <div className="mt-3 text-center">
                            <p className="text-sm text-gray-600">
                                {t('register.alreadyHaveAccount')}{' '}
                                <Link to="/" className="font-semibold hover:underline" style={{color: '#137fec'}}>
                                    {t('register.loginLink')}
                                </Link>
                            </p>
                        </div>

                        {/* Language Selector */}
                        <div className="mt-3 pt-3 border-t border-gray-200 flex flex-col items-center">
                            <p className="text-xs text-gray-600 mb-1">{t('common.selectLanguage')}</p>
                            <LanguageSelector />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default Register;
