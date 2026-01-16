import { Karyakarta, WhatsAppLog } from '@/types';
import { addWhatsAppLog, getPolitician } from './storage.service';
import { toast } from '@/hooks/use-toast';

// Birthday messages in different languages
const birthdayMessages = {
  en: {
    greeting: 'Happy Birthday',
    message: 'Wishing you a wonderful birthday filled with joy and happiness! May all your dreams come true.',
    from: 'With warm wishes from',
  },
  hi: {
    greeting: 'जन्मदिन मुबारक हो',
    message: 'आपको खुशियों और समृद्धि से भरा जन्मदिन की हार्दिक शुभकामनाएं! आपके सभी सपने सच हों।',
    from: 'हार्दिक शुभकामनाओं के साथ',
  },
  mr: {
    greeting: 'वाढदिवसाच्या हार्दिक शुभेच्छा',
    message: 'तुम्हाला आनंद आणि समृद्धीने भरलेला वाढदिवस लाभो! तुमची सर्व स्वप्ने पूर्ण होवोत।',
    from: 'हार्दिक शुभेच्छांसह',
  },
};

// Generate WhatsApp message text
export const generateWhatsAppMessage = (
  karyakartaName: string,
  language: 'en' | 'hi' | 'mr'
): string => {
  const politician = getPolitician();
  const msgs = birthdayMessages[language];

  return `🎂 *${msgs.greeting}, ${karyakartaName}!* 🎉

${msgs.message}

${msgs.from}
*${politician.name}*
${politician.position}`;
};

// Simulate sending WhatsApp message
// Simulate sending WhatsApp message
export const sendWhatsAppMessage = async (
  karyakarta: Karyakarta,
  language: 'en' | 'hi' | 'mr',
  bannerDataUrl?: string,
  onStatusUpdate?: (status: string) => void
): Promise<WhatsAppLog> => {
  const message = generateWhatsAppMessage(karyakarta.name, language);

  const politician = getPolitician();

  if (!politician.phoneNumberId || !politician.accessToken) {
    throw new Error("WhatsApp not connected. Please connect from the dashboard.");
  }

  // Use the backend to send the message
  onStatusUpdate?.(`📤 Sending request to backend...`);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  try {
    const response = await fetch(`${API_URL}/send-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipientNumber: karyakarta.whatsapp,
        messageBody: message,
        imageUrl: bannerDataUrl || "",
        phoneNumberId: politician.phoneNumberId,
        accessToken: politician.accessToken
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail?.error?.message || "Failed to send message via backend");
    }

    const data = await response.json();
    console.log("Backend response:", data);

    onStatusUpdate?.(`✅ Message sent to ${karyakarta.whatsapp}`);
    toast({
      title: 'Message Sent! 🎉',
      description: `Birthday wish sent to ${karyakarta.name}`,
    });

    return addWhatsAppLog({
      recipientName: karyakarta.name,
      recipientNumber: karyakarta.whatsapp,
      message,
      bannerUrl: bannerDataUrl,
      status: 'sent',
      language,
    });

  } catch (error: any) {
    console.error("Backend Error:", error);
    onStatusUpdate?.(`❌ Failed: ${error.message}`);
    toast({
      title: 'Send Failed',
      description: error.message || `Could not send message to ${karyakarta.name}`,
      variant: 'destructive',
    });

    return addWhatsAppLog({
      recipientName: karyakarta.name,
      recipientNumber: karyakarta.whatsapp,
      message,
      bannerUrl: bannerDataUrl,
      status: 'failed',
      language,
    });
  }
};

// Send bulk birthday wishes
export const sendBulkBirthdayWishes = async (
  karyakartas: Karyakarta[],
  language: 'en' | 'hi' | 'mr',
  getBannerForKaryakarta: (karyakarta: Karyakarta) => Promise<string>,
  onProgress?: (current: number, total: number, status: string) => void
): Promise<WhatsAppLog[]> => {
  const logs: WhatsAppLog[] = [];

  for (let i = 0; i < karyakartas.length; i++) {
    const karyakarta = karyakartas[i];
    onProgress?.(i + 1, karyakartas.length, `Sending to ${karyakarta.name}...`);

    try {
      const bannerUrl = await getBannerForKaryakarta(karyakarta);
      const log = await sendWhatsAppMessage(karyakarta, language, bannerUrl);
      logs.push(log);
    } catch (error) {
      console.error(`Failed to send to ${karyakarta.name}:`, error);
    }

    // Small delay between messages
    if (i < karyakartas.length - 1) {
      await delay(300);
    }
  }

  return logs;
};

// Helper delay function
const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Format phone number for display
export const formatPhoneNumber = (phone: string): string => {
  // Simple formatting - can be enhanced
  return phone.replace(/(\+\d{2})(\d{5})(\d{5})/, '$1 $2 $3');
};
