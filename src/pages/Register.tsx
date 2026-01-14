import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LanguageSelector } from '@/components/LanguageSelector';
import { register, initializeDemoData } from '@/services/storage.service';
import { Cake, Sparkles, User, Mail, Lock, Briefcase } from 'lucide-react';
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.password || !formData.position) {
            toast.error('Please fill in all fields');
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
                            <h1 className="text-2xl font-bold text-foreground mb-2">{t('register.title')}</h1>
                            <p className="text-muted-foreground">{t('register.subtitle')}</p>
                        </motion.div>

                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="gap-2 flex flex-col">
                                <Label htmlFor="name">{t('register.name')}</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        className="pl-10"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="gap-2 flex flex-col">
                                <Label htmlFor="email">{t('register.email')}</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        className="pl-10"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="gap-2 flex flex-col">
                                <Label htmlFor="password">{t('register.password')}</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Create a password"
                                        className="pl-10"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="gap-2 flex flex-col">
                                <Label htmlFor="position">{t('register.position')}</Label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="position"
                                        name="position"
                                        type="text"
                                        placeholder="e.g. Member of Parliament"
                                        className="pl-10"
                                        value={formData.position}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full gradient-saffron text-primary-foreground font-semibold h-12 text-base gap-2 shadow-lg hover:shadow-xl transition-shadow mt-6"
                            >
                                <Sparkles className="h-5 w-5" />
                                {t('register.registerButton')}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                {t('register.alreadyHaveAccount')}{' '}
                                <Link to="/" className="text-primary font-semibold hover:underline">
                                    {t('register.loginLink')}
                                </Link>
                            </p>
                        </div>

                        {/* Language Selector */}
                        <div className="mt-8 pt-6 border-t border-muted flex flex-col items-center">
                            <p className="text-xs text-muted-foreground mb-3">{t('common.selectLanguage')}</p>
                            <LanguageSelector />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default Register;
