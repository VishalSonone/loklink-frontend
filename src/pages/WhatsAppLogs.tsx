import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getWhatsAppLogs, clearWhatsAppLogs } from '@/services/storage.service';
import { WhatsAppLog } from '@/types';
import { formatPhoneNumber } from '@/services/whatsapp.service';
import { MessageSquare, CheckCircle, Clock, XCircle, Trash2, Eye, Image } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

const WhatsAppLogs = () => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<WhatsAppLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<WhatsAppLog | null>(null);
  
  useEffect(() => {
    setLogs(getWhatsAppLogs());
  }, []);
  
  const handleClearLogs = () => {
    clearWhatsAppLogs();
    setLogs([]);
    toast({
      title: 'Logs Cleared',
      description: 'All WhatsApp logs have been cleared.',
    });
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-accent-foreground" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };
  
  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      sent: 'bg-success/10 text-success border-success/20',
      pending: 'bg-accent text-accent-foreground border-accent',
      failed: 'bg-destructive/10 text-destructive border-destructive/20',
    };
    return variants[status] || '';
  };
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const getLanguageLabel = (lang: string) => {
    const labels: Record<string, string> = {
      en: '🇬🇧 English',
      hi: '🇮🇳 Hindi',
      mr: '🇮🇳 Marathi',
    };
    return labels[lang] || lang;
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('whatsapp.title')}</h1>
            <p className="text-muted-foreground">
              {logs.length} message{logs.length !== 1 ? 's' : ''} logged
            </p>
          </div>
          
          {logs.length > 0 && (
            <Button variant="outline" onClick={handleClearLogs} className="gap-2 text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
              Clear Logs
            </Button>
          )}
        </div>
        
        {/* Logs List */}
        {logs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="font-medium text-foreground mb-1">{t('whatsapp.noLogs')}</h3>
              <p className="text-sm text-muted-foreground">
                Send birthday wishes to see logs here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {logs.map((log, index) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card className="hover:shadow-md transition-shadow border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          {/* Status Icon */}
                          <div className="flex-shrink-0 mt-1">
                            {getStatusIcon(log.status)}
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-foreground">{log.recipientName}</h3>
                              <Badge variant="outline" className={getStatusBadge(log.status)}>
                                {t(`whatsapp.${log.status}`)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {formatPhoneNumber(log.recipientNumber)}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              <span>{formatTimestamp(log.timestamp)}</span>
                              <span>•</span>
                              <span>{getLanguageLabel(log.language)}</span>
                              {log.bannerUrl && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Image className="h-3 w-3" />
                                    Banner attached
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* View Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedLog(log)}
                          className="gap-1 flex-shrink-0"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      {/* Message Preview Modal */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Message Preview</DialogTitle>
          </DialogHeader>
          
          {selectedLog && (
            <div className="space-y-4">
              {/* WhatsApp-style message bubble */}
              <div className="bg-[#DCF8C6] rounded-lg p-4 shadow-sm">
                <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800">
                  {selectedLog.message}
                </pre>
              </div>
              
              {/* Banner Preview */}
              {selectedLog.bannerUrl && (
                <div>
                  <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                    <Image className="h-4 w-4" />
                    Attached Banner
                  </p>
                  <img
                    src={selectedLog.bannerUrl}
                    alt="Birthday Banner"
                    className="w-full rounded-lg shadow-md"
                  />
                </div>
              )}
              
              {/* Metadata */}
              <div className="pt-3 border-t border-border">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Recipient</p>
                    <p className="font-medium text-foreground">{selectedLog.recipientName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium text-foreground">{selectedLog.recipientNumber}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge variant="outline" className={getStatusBadge(selectedLog.status)}>
                      {t(`whatsapp.${selectedLog.status}`)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Language</p>
                    <p className="font-medium text-foreground">{getLanguageLabel(selectedLog.language)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default WhatsAppLogs;
