import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Download, FileText, CreditCard, Users, MessageSquare, AlertTriangle, Lock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';

const Subscription = () => {
    const { t } = useTranslation();

    // Mock data matching the "Pragati" plan from the image
    const currentUsage = {
        planName: 'Pragati (Pro)',
        price: '₹2,500',
        renews: 'Oct 24, 2026',
        status: t('subscription.active'),
        karyakartas: {
            used: 4500,
            total: 5000,
            label: t('subscription.usage.karyakartas'),
            sublabel: t('subscription.usage.karyakartaLimit'),
            warning: `90% ${t('subscription.usage.used')} - ${t('subscription.usage.upgradeRecommended')}`,
        },
        whatsapp: {
            used: 12000,
            total: 15000,
            label: t('subscription.usage.whatsapp'),
            sublabel: t('subscription.usage.whatsappLimit'),
            resetText: `${t('subscription.usage.resetsIn')} 12 ${t('subscription.usage.days')}`,
        }
    };

    const plans = [
        {
            name: 'VIKAS',
            price: '₹1,000',
            period: `/${t('subscription.month')}`,
            description: t('subscription.plans.vikasDesc'),
            features: [
                { name: `1,000 ${t('subscription.features.karyakartas')}`, included: true },
                { name: t('subscription.features.basicDashboard'), included: true },
                { name: t('subscription.features.whatsappIntegration'), included: false },
                { name: t('subscription.features.analytics'), included: false },
            ],
            current: false,
            cta: t('subscription.downgrade'),
            ctaVariant: 'outline' as const,
        },
        {
            name: 'PRAGATI',
            price: '₹2,500',
            period: `/${t('subscription.month')}`,
            description: t('subscription.plans.pragatiDesc'),
            features: [
                { name: `5,000 ${t('subscription.features.karyakartas')}`, included: true },
                { name: t('subscription.features.whatsappIntegration'), included: true },
                { name: t('subscription.features.bulkSMS'), included: true },
                { name: t('subscription.features.dedicatedManager'), included: false },
            ],
            current: true,
            cta: t('subscription.active'),
            ctaVariant: 'default' as const,
        },
        {
            name: 'SANKALP',
            price: 'Custom',
            period: '',
            description: t('subscription.plans.sankalpDesc'),
            features: [
                { name: t('subscription.features.unlimitedKaryakartas'), included: true },
                { name: t('subscription.features.apiAccess'), included: true },
                { name: t('subscription.features.dedicatedManager'), included: true },
                { name: t('subscription.features.customReporting'), included: true },
            ],
            current: false,
            cta: t('subscription.contactSales'),
            ctaVariant: 'default' as const,
        },
    ];

    const billingHistory = [
        { id: '#INV-2023-009', date: 'Sept 24, 2023', plan: 'Pragati (Pro)', amount: '₹2,500', status: t('subscription.table.paid') },
        { id: '#INV-2023-008', date: 'Aug 24, 2023', plan: 'Pragati (Pro)', amount: '₹2,500', status: t('subscription.table.paid') },
        { id: '#INV-2023-007', date: 'July 24, 2023', plan: 'Vikas (Basic)', amount: '₹1,000', status: t('subscription.table.paid') },
    ];

    return (
        <Layout>
            <div className="space-y-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">{t('subscription.title')}</h1>
                        <p className="text-muted-foreground mt-1">{t('subscription.subtitle')}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="gap-2">
                            <FileText className="h-4 w-4" /> {t('subscription.invoices')}
                        </Button>
                        <Button variant="outline" className="gap-2">
                            <CreditCard className="h-4 w-4" /> {t('subscription.paymentMethods')}
                        </Button>
                    </div>
                </div>

                {/* Usage Overview Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Current Plan Card */}
                    <Card className="bg-card shadow-sm border-border relative overflow-hidden">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <CheckCircle2 className="h-32 w-32" />
                        </div>
                        <CardContent className="pt-6 relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none font-semibold px-2.5 py-0.5 rounded-md">
                                    {currentUsage.status}
                                </Badge>
                                <span className="text-sm text-muted-foreground">{t('subscription.renews')} {currentUsage.renews}</span>
                            </div>
                            <h2 className="text-3xl font-bold mb-1">{currentUsage.planName}</h2>
                            <p className="text-muted-foreground mb-6">{currentUsage.price} / {t('subscription.month')}</p>
                            <Button variant="link" className="p-0 h-auto text-primary font-semibold hover:no-underline group">
                                {t('subscription.manage')} <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Karyakartas Usage */}
                    <Card className="bg-card shadow-sm border-border">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">{currentUsage.karyakartas.label}</h3>
                                    <p className="text-sm text-muted-foreground">{currentUsage.karyakartas.sublabel}</p>
                                </div>
                            </div>

                            <div className="flex items-end justify-between mb-2">
                                <span className="text-2xl font-bold">{currentUsage.karyakartas.used.toLocaleString()}</span>
                                <span className="text-sm text-muted-foreground mb-1">{t('subscription.usage.of')} {currentUsage.karyakartas.total.toLocaleString()}</span>
                            </div>

                            <div className="h-2 w-full bg-secondary/20 rounded-full overflow-hidden mb-3">
                                <div
                                    className="h-full bg-orange-500 rounded-full"
                                    style={{ width: `${(currentUsage.karyakartas.used / currentUsage.karyakartas.total) * 100}%` }}
                                />
                            </div>

                            {currentUsage.karyakartas.warning && (
                                <div className="flex items-center gap-2 text-sm text-orange-600 font-medium">
                                    <AlertTriangle className="h-4 w-4" />
                                    {currentUsage.karyakartas.warning}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* WhatsApp Usage */}
                    <Card className="bg-card shadow-sm border-border">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                    <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">{currentUsage.whatsapp.label}</h3>
                                    <p className="text-sm text-muted-foreground">{currentUsage.whatsapp.sublabel}</p>
                                </div>
                            </div>

                            <div className="flex items-end justify-between mb-2">
                                <span className="text-2xl font-bold">{currentUsage.whatsapp.used.toLocaleString()}</span>
                                <span className="text-sm text-muted-foreground mb-1">{t('subscription.usage.of')} {currentUsage.whatsapp.total.toLocaleString()}</span>
                            </div>

                            <div className="h-2 w-full bg-secondary/20 rounded-full overflow-hidden mb-3">
                                <div
                                    className="h-full bg-green-500 rounded-full"
                                    style={{ width: `${(currentUsage.whatsapp.used / currentUsage.whatsapp.total) * 100}%` }}
                                />
                            </div>

                            <div className="text-sm text-muted-foreground">
                                {currentUsage.whatsapp.resetText}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Available Plans Section */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">{t('subscription.availablePlans')}</h2>
                        <div className="bg-muted p-1 rounded-lg inline-flex">
                            <Button variant="outline" size="sm" className="bg-background shadow-sm h-8 text-xs border-transparent hover:bg-background">{t('subscription.monthly')}</Button>
                            <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-foreground">{t('subscription.yearly')}</Button>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {plans.map((plan, i) => (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="h-full"
                            >
                                <Card className={`h-full flex flex-col relative transition-all duration-200 ${plan.current ? 'border-primary ring-1 ring-primary shadow-md' : 'border-border hover:border-primary/50'}`}>
                                    {plan.current && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                            <Badge className="bg-primary hover:bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                                                {t('subscription.currentPlan')}
                                            </Badge>
                                        </div>
                                    )}

                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{plan.name}</CardTitle>
                                        <div className="mt-2 flex items-baseline">
                                            <span className={`text-4xl font-bold ${plan.current ? 'text-primary' : 'text-foreground'}`}>{plan.price}</span>
                                            <span className="text-muted-foreground ml-1">{plan.period}</span>
                                        </div>
                                        <CardDescription className="mt-2 h-10">{plan.description}</CardDescription>
                                    </CardHeader>

                                    <CardContent className="flex-1 pb-4">
                                        {plan.current ? (
                                            <div className="w-full py-2.5 mb-6 bg-primary/10 text-primary rounded-md flex items-center justify-center gap-2 font-medium">
                                                <CheckCircle2 className="h-4 w-4" /> {t('subscription.active')}
                                            </div>
                                        ) : (
                                            <Button
                                                className="w-full mb-6 py-5"
                                                variant={plan.name === 'SANKALP' ? 'default' : 'outline'}
                                            >
                                                {plan.cta}
                                            </Button>
                                        )}

                                        <Separator className="mb-6" />

                                        <ul className="space-y-3">
                                            {plan.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center gap-3 text-sm">
                                                    {feature.included ? (
                                                        <Check className={`h-4 w-4 shrink-0 ${plan.current ? 'text-primary' : 'text-green-600'}`} />
                                                    ) : (
                                                        <Lock className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                                                    )}
                                                    <span className={feature.included ? 'text-foreground' : 'text-muted-foreground'}>
                                                        {feature.name}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Billing History */}
                <div className="pb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">{t('subscription.billingHistory')}</h2>
                        <Button variant="link" className="text-primary h-auto p-0 font-semibold">{t('subscription.viewAll')}</Button>
                    </div>
                    <Card className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">{t('subscription.table.invoiceId')}</th>
                                        <th className="px-6 py-4 font-semibold">{t('subscription.table.date')}</th>
                                        <th className="px-6 py-4 font-semibold">{t('subscription.table.plan')}</th>
                                        <th className="px-6 py-4 font-semibold">{t('subscription.table.amount')}</th>
                                        <th className="px-6 py-4 font-semibold">{t('subscription.table.status')}</th>
                                        <th className="px-6 py-4 font-semibold text-right">{t('subscription.table.action')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {billingHistory.map((invoice) => (
                                        <tr key={invoice.id} className="bg-card hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4 font-medium">{invoice.id}</td>
                                            <td className="px-6 py-4 text-muted-foreground">{invoice.date}</td>
                                            <td className="px-6 py-4">{invoice.plan}</td>
                                            <td className="px-6 py-4 font-bold">{invoice.amount}</td>
                                            <td className="px-6 py-4">
                                                <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none font-medium text-xs">
                                                    {invoice.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default Subscription;
