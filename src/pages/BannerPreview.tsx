import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { getKaryakartas, getPolitician } from '@/services/storage.service';
import { generateBanner, downloadBanner } from '@/services/banner.service';
import { Karyakarta, TemplateId } from '@/types';
import { languages } from '@/i18n';
import { getTranslatedKaryakartaName, getTranslatedPoliticianName } from '@/i18n/translations';
import { Download, RefreshCw, Image, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const templates: { id: TemplateId; labelKey: string; colors: string[] }[] = [
  { id: 'modern-gradient', labelKey: 'banner.template1', colors: ['#E8772E', '#F5A623'] },
  { id: 'political-branding', labelKey: 'banner.template2', colors: ['#1a2744', '#E8772E'] },
  { id: 'minimal-premium', labelKey: 'banner.template3', colors: ['#FFFFFF', '#1a2744'] },
  { id: 'festive', labelKey: 'banner.template4', colors: ['#FFE0B2', '#E8772E'] },
];

const BannerPreview = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [karyakartas, setKaryakartas] = useState<Karyakarta[]>([]);
  const [selectedKaryakarta, setSelectedKaryakarta] = useState<Karyakarta | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('modern-gradient');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi' | 'mr'>('hi'); // Default to Hindi for banner
  const [isGenerating, setIsGenerating] = useState(false);

  // Use state to hold politician data so it doesn't change on every render (breaking the useEffect loop)
  const [politician] = useState(getPolitician());

  useEffect(() => {
    const allKaryakartas = getKaryakartas();
    setKaryakartas(allKaryakartas);

    // Check if navigated with a pre-selected karyakarta
    const stateKaryakarta = (location.state as any)?.karyakarta;
    if (stateKaryakarta) {
      setSelectedKaryakarta(stateKaryakarta);
    } else if (allKaryakartas.length > 0) {
      setSelectedKaryakarta(allKaryakartas[0]);
    }
  }, [location.state]);

  const generateBannerPreview = useCallback(async () => {
    if (!selectedKaryakarta) return;

    setIsGenerating(true);
    try {
      const canvas = await generateBanner(selectedTemplate, {
        karyakartaName: selectedKaryakarta.name,
        karyakartaPhoto: selectedKaryakarta.photo,
        politicianName: politician.name,
        politicianPosition: politician.position,
        politicianPhoto: politician.photo,
        language: selectedLanguage,
        translatedPoliticianName: getTranslatedPoliticianName(selectedLanguage),
        translatedKaryakartaName: getTranslatedKaryakartaName(selectedLanguage, selectedKaryakarta.name),
      });

      canvasRef.current = canvas;

      // Display canvas
      if (canvasContainerRef.current) {
        canvasContainerRef.current.innerHTML = '';
        canvas.style.maxWidth = '100%';
        canvas.style.height = 'auto';
        canvas.style.borderRadius = '8px';
        canvas.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        canvasContainerRef.current.appendChild(canvas);
      }
    } catch (error) {
      console.error('Error generating banner:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate banner.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  }, [selectedKaryakarta, selectedTemplate, selectedLanguage, politician]);

  useEffect(() => {
    if (selectedKaryakarta) {
      generateBannerPreview();
    }
  }, [selectedKaryakarta, selectedTemplate, selectedLanguage, generateBannerPreview]);

  const handleDownload = () => {
    if (canvasRef.current && selectedKaryakarta) {
      downloadBanner(canvasRef.current, `birthday-${selectedKaryakarta.name.replace(/\s+/g, '-')}.png`);
      toast({
        title: 'Downloaded! 🎉',
        description: 'Banner saved to your device.',
      });
    }
  };

  return (
    <Layout>
      <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
        {/* Preview Section */}
        <Card className="order-2 lg:order-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5 text-primary" />
              {t('banner.preview')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedKaryakarta ? (
              <div className="aspect-[3/2] flex items-center justify-center bg-muted rounded-lg">
                <p className="text-muted-foreground">{t('banner.noSelection')}</p>
              </div>
            ) : (
              <div className="relative">
                {isGenerating && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg z-10">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span>Generating...</span>
                    </div>
                  </div>
                )}
                <div ref={canvasContainerRef} className="flex justify-center" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Controls Section */}
        <div className="order-1 lg:order-2 space-y-4">
          {/* Karyakarta Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t('banner.selectKaryakarta')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedKaryakarta?.id || ''}
                onValueChange={(value) => {
                  const k = karyakartas.find((k) => k.id === value);
                  setSelectedKaryakarta(k || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('banner.selectKaryakarta')} />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  {karyakartas.map((k) => (
                    <SelectItem key={k.id} value={k.id}>
                      {k.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Template Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t('banner.selectTemplate')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {templates.map((template) => (
                <motion.button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`w-full p-3 rounded-lg border-2 flex items-center gap-3 transition-all ${selectedTemplate === template.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                    }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex gap-1">
                    {template.colors.map((color, i) => (
                      <div
                        key={i}
                        className="h-6 w-6 rounded"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span className="font-medium text-foreground">{t(template.labelKey)}</span>
                </motion.button>
              ))}
            </CardContent>
          </Card>

          {/* Language Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t('banner.selectLanguage')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedLanguage}
                onValueChange={(value) => setSelectedLanguage(value as 'en' | 'hi' | 'mr')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={generateBannerPreview}
              disabled={!selectedKaryakarta || isGenerating}
              variant="outline"
              className="flex-1 gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
              {t('banner.generate')}
            </Button>
            <Button
              onClick={handleDownload}
              disabled={!selectedKaryakarta || !canvasRef.current}
              className="flex-1 gradient-saffron text-primary-foreground gap-2"
            >
              <Download className="h-4 w-4" />
              {t('banner.download')}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BannerPreview;
