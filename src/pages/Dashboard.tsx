import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import {
  getKaryakartas,
  getTodaysBirthdays,
  getWhatsAppLogs,
  getPolitician,
} from '@/services/storage.service';
import { generateBanner, getBannerDataUrl } from '@/services/banner.service';
import { sendBulkBirthdayWishes } from '@/services/whatsapp.service';
import { Karyakarta } from '@/types';
import { Users, Cake, Send, CheckCircle, Clock, PartyPopper, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLocalizedName } from '@/utils/localization';
import { ConnectWhatsApp } from '@/components/ConnectWhatsApp';

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [karyakartas, setKaryakartas] = useState<Karyakarta[]>([]);
  const [todaysBirthdays, setTodaysBirthdays] = useState<Karyakarta[]>([]);
  const [sentToday, setSentToday] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [sendingProgress, setSendingProgress] = useState('');
  const politician = getPolitician();

  const [messageStatusMap, setMessageStatusMap] = useState<Record<string, string>>({});

  const loadData = useCallback(() => {
    const allKaryakartas = getKaryakartas();
    setKaryakartas(allKaryakartas);
    setTodaysBirthdays(getTodaysBirthdays());

    // Count today's sent messages and build status map
    const logs = getWhatsAppLogs();
    const today = new Date().toDateString();

    const todaysLogs = logs.filter((log) => new Date(log.timestamp).toDateString() === today);
    const statusMap: Record<string, string> = {};

    todaysLogs.forEach(log => {
      statusMap[log.recipientNumber] = log.status;
    });

    setMessageStatusMap(statusMap);

    const todaysSent = todaysLogs.filter(log => log.status === 'sent');
    setSentToday(todaysSent.length);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-detect birthdays on load
  useEffect(() => {
    if (todaysBirthdays.length > 0) {
      toast({
        title: `🎂 ${t('dashboard.birthdayAlert')}`,
        description: `${getLocalizedName(todaysBirthdays[0], i18n.language)} ${t('dashboard.hasBirthdayToday')}`,
      });
    }
  }, [todaysBirthdays, t, i18n.language]);

  const handleSendWishes = async () => {
    if (todaysBirthdays.length === 0) {
      toast({
        title: t('dashboard.noTodayBirthdays'),
        description: 'No birthday wishes to send today.',
      });
      return;
    }

    setIsSending(true);
    setSendingProgress('Preparing banners...');

    try {
      await sendBulkBirthdayWishes(
        todaysBirthdays,
        i18n.language as 'en' | 'hi' | 'mr',
        async (karyakarta) => {
          const canvas = await generateBanner(politician.selectedTemplate || 'modern-gradient', {
            karyakartaName: karyakarta.name,
            karyakartaPhoto: karyakarta.photo,
            politicianName: politician.name,
            politicianPosition: politician.position,
            politicianPhoto: politician.photo,
            language: i18n.language as 'en' | 'hi' | 'mr',
            translatedPoliticianName: t('politician.name'),
            translatedKaryakartaName: getLocalizedName(karyakarta, i18n.language),
          });
          return getBannerDataUrl(canvas);
        },
        (current, total, status) => {
          setSendingProgress(`(${current}/${total}) ${status}`);
        }
      );

      toast({
        title: '🎉 All wishes sent!',
        description: `Sent birthday wishes to ${todaysBirthdays.length} karyakarta(s).`,
      });

      loadData();
    } catch (error) {
      console.error('Error sending wishes:', error);
      toast({
        title: 'Error',
        description: 'Failed to send some messages. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
      setSendingProgress('');
    }
  };

  const stats = [
    {
      title: t('dashboard.totalKaryakartas'),
      value: karyakartas.length,
      icon: Users,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
    },
    {
      title: t('dashboard.todaysBirthdays'),
      value: todaysBirthdays.length,
      icon: Cake,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: t('dashboard.wishesScheduled'),
      value: sentToday,
      icon: CheckCircle,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      title: t('dashboard.pendingWishes'),
      value: Math.max(0, todaysBirthdays.length - sentToday),
      icon: Clock,
      color: 'text-accent-foreground',
      bg: 'bg-accent/50',
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t('dashboard.welcome')}, {t('politician.name').split(' ')[0]}! 👋
            </h1>
            <p className="text-muted-foreground">{t('politician.position')}</p>
          </div>

          <Button
            onClick={handleSendWishes}
            disabled={isSending || todaysBirthdays.length === 0}
            size="lg"
            className="gradient-saffron text-primary-foreground gap-2 font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            {isSending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {t('dashboard.sendingWishes')}
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                {t('dashboard.sendWishes')}
              </>
            )}
          </Button>
        </motion.div>

        {/* Connect WhatsApp Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ConnectWhatsApp />
        </motion.div>

        {/* Progress indicator */}
        <AnimatePresence>
          {sendingProgress && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground"
            >
              {sendingProgress}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Grid */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                        <Icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.title}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Today's Birthdays */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <PartyPopper className="h-5 w-5 text-primary" />
                  {t('dashboard.todaysBirthdays')}
                </CardTitle>
                {todaysBirthdays.length > 0 && (
                  <Badge className="gradient-saffron text-primary-foreground">
                    {todaysBirthdays.length} 🎂
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {todaysBirthdays.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Gift className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>{t('dashboard.noTodayBirthdays')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todaysBirthdays.map((karyakarta, index) => {
                    const status = messageStatusMap[karyakarta.whatsapp];
                    return (
                      <motion.div
                        key={karyakarta.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full gradient-saffron flex items-center justify-center text-sm font-bold text-primary-foreground">
                            {getLocalizedName(karyakarta, i18n.language).charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{getLocalizedName(karyakarta, i18n.language)}</p>
                            <p className="text-xs text-muted-foreground">{karyakarta.whatsapp}</p>
                            {status && (
                              <Badge variant="outline" className={`mt-1 text-[10px] px-1.5 py-0 h-4 border-0 ${status === 'sent' ? 'bg-green-100 text-green-700' :
                                status === 'failed' ? 'bg-red-100 text-red-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                {status === 'sent' ? 'Sent' : status === 'failed' ? 'Failed' : 'Pending'}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/banner', { state: { karyakarta } })}
                            className="gap-1 h-8"
                          >
                            <Cake className="h-3 w-3" />
                            {t('common.preview')}
                          </Button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Dashboard;
