import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getPolitician, updatePolitician } from '@/services/storage.service';
import { toast } from '@/hooks/use-toast';
import { Camera, Save, User, Mail, Lock, Briefcase } from 'lucide-react';
import { Politician } from '@/types';

const Profile = () => {
    const { t } = useTranslation();
    const [politician, setPolitician] = useState<Politician>(getPolitician());
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPolitician((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5000000) { // 5MB limit
                toast({
                    title: t('common.error'),
                    description: "Image size should be less than 5MB",
                    variant: 'destructive',
                });
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setPolitician((prev) => ({
                    ...prev,
                    photo: reader.result as string,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            updatePolitician(politician);
            toast({
                title: t('common.success'),
                description: t('profile.success'),
            });
            // Force reload to update header avatar/name if changed
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error(error);
            toast({
                title: t('common.error'),
                description: "Failed to update profile",
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-2xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">{t('profile.title')}</h1>
                    <p className="text-muted-foreground">{t('profile.personalInfo')}</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('profile.title')}</CardTitle>
                        <CardDescription>{t('profile.personalInfo')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Photo Upload */}
                            <div className="flex flex-col items-center gap-4 py-4">
                                <div className="relative">
                                    <div className="h-24 w-24 rounded-full gradient-saffron flex items-center justify-center overflow-hidden border-4 border-background shadow-xl">
                                        {politician.photo ? (
                                            <img src={politician.photo} alt={politician.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="text-3xl font-bold text-primary-foreground">
                                                {politician.name.charAt(0)}
                                            </span>
                                        )}
                                    </div>
                                    <label
                                        htmlFor="photo-upload"
                                        className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-md"
                                    >
                                        <Camera className="h-4 w-4" />
                                        <input
                                            id="photo-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handlePhotoUpload}
                                        />
                                    </label>
                                </div>
                                <div className="text-center">
                                    <h3 className="font-semibold text-foreground">{politician.name}</h3>
                                    <p className="text-sm text-muted-foreground">{politician.position}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name" className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        {t('register.name')}
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={politician.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="position" className="flex items-center gap-2">
                                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                                        {t('register.position')}
                                    </Label>
                                    <Input
                                        id="position"
                                        name="position"
                                        value={politician.position}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        {t('register.email')}
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={politician.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password" className="flex items-center gap-2">
                                        <Lock className="h-4 w-4 text-muted-foreground" />
                                        {t('register.password')}
                                    </Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={politician.password}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={loading} className="gradient-saffron text-primary-foreground w-full sm:w-auto">
                                    {loading ? (
                                        <>
                                            <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                            {t('common.loading')}
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            {t('profile.updateProfile')}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default Profile;
