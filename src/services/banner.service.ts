import { BannerData, TemplateId } from '@/types';

// Birthday messages in different languages
const birthdayMessages = {
  en: {
    title: 'Happy Birthday',
    message: 'Wishing you a wonderful birthday filled with joy and happiness!',
    from: 'With warm wishes from',
  },
  hi: {
    title: 'जन्मदिन मुबारक',
    message: 'आपको खुशियों और समृद्धि से भरा जन्मदिन की शुभकामनाएं!',
    from: 'हार्दिक शुभकामनाओं के साथ',
  },
  mr: {
    title: 'वाढदिवसाच्या शुभेच्छा',
    message: 'तुम्हाला आनंद आणि समृद्धीने भरलेला वाढदिवस लाभो!',
    from: 'शुभेच्छांसह',
  },
};

// Load image from URL or data URL
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const placeholderSvg = 'data:image/svg+xml,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">' +
      '<rect fill="#ddd" width="100" height="100"/>' +
      '<text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#666" font-size="14">No Photo</text>' +
      '</svg>'
    );

    img.onload = () => resolve(img);
    img.onerror = () => {
      // If image fails to load, use placeholder
      const placeholderImg = new Image();
      placeholderImg.onload = () => resolve(placeholderImg);
      placeholderImg.onerror = () => resolve(placeholderImg); // Even if placeholder fails, resolve
      placeholderImg.src = placeholderSvg;
    };

    img.src = src || placeholderSvg;
  });
};

// Draw circular image on canvas
const drawCircularImage = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  centerX: number,
  centerY: number,
  radius: number,
  borderWidth: number = 0,
  borderColor: string = '#fff'
) => {
  // Draw border circle if needed
  if (borderWidth > 0) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + borderWidth, 0, Math.PI * 2);
    ctx.fillStyle = borderColor;
    ctx.fill();
  }

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(img, centerX - radius, centerY - radius, radius * 2, radius * 2);
  ctx.restore();
};

// Draw rectangular image with border
const drawRectImage = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  borderWidth: number = 0,
  borderColor: string = '#fff'
) => {
  if (borderWidth > 0) {
    ctx.fillStyle = borderColor;
    ctx.fillRect(x - borderWidth, y - borderWidth, width + borderWidth * 2, height + borderWidth * 2);
  }
  ctx.drawImage(img, x, y, width, height);
};

// Template 1: Modern Gradient - Clean horizontal layout
const drawModernGradient = async (
  canvas: HTMLCanvasElement,
  data: BannerData
): Promise<void> => {
  const ctx = canvas.getContext('2d')!;
  const messages = birthdayMessages[data.language];

  // Background gradient (saffron to gold)
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#E8772E');
  gradient.addColorStop(0.5, '#F5A623');
  gradient.addColorStop(1, '#E8772E');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Decorative circles
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.beginPath();
  ctx.arc(-30, -30, 120, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(canvas.width + 30, canvas.height + 30, 100, 0, Math.PI * 2);
  ctx.fill();

  // Load images
  const [karyakartaImg, politicianImg] = await Promise.all([
    loadImage(data.karyakartaPhoto),
    loadImage(data.politicianPhoto),
  ]);

  // LEFT SECTION: Karyakarta photo (centered vertically on left)
  const karyakartaRadius = 80;
  const karyakartaCenterX = 110;
  const karyakartaCenterY = canvas.height / 2;
  drawCircularImage(ctx, karyakartaImg, karyakartaCenterX, karyakartaCenterY, karyakartaRadius, 4, '#FFFFFF');

  // RIGHT SECTION: Text content
  const textStartX = 220;
  const textWidth = canvas.width - textStartX - 20;

  // Birthday title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 42px "Noto Sans Devanagari", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(messages.title, textStartX, 70);

  // Karyakarta name
  ctx.font = 'bold 32px "Noto Sans Devanagari", sans-serif';
  ctx.fillStyle = '#1a2744';
  ctx.fillText(data.translatedKaryakartaName || data.karyakartaName, textStartX, 115);

  // Decorative line
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(textStartX, 130);
  ctx.lineTo(textStartX + 150, 130);
  ctx.stroke();

  // Message
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '18px "Noto Sans Devanagari", sans-serif';
  wrapText(ctx, messages.message, textStartX, 165, textWidth, 24);

  // BOTTOM RIGHT: Politician section
  const politicianRadius = 35;
  const politicianCenterX = canvas.width - 60;
  const politicianCenterY = canvas.height - 55;
  drawCircularImage(ctx, politicianImg, politicianCenterX, politicianCenterY, politicianRadius, 2, '#FFFFFF');

  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'right';
  ctx.font = '12px "Noto Sans Devanagari", sans-serif';
  ctx.fillText(messages.from, politicianCenterX - 50, canvas.height - 75);
  ctx.font = 'bold 14px "Noto Sans Devanagari", sans-serif';
  ctx.fillText(data.translatedPoliticianName || data.politicianName, politicianCenterX - 50, canvas.height - 55);
  ctx.font = '11px "Noto Sans Devanagari", sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.fillText(data.politicianPosition, politicianCenterX - 50, canvas.height - 38);
};

// Template 2: Political Branding - Clear zones with header
const drawPoliticalBranding = async (
  canvas: HTMLCanvasElement,
  data: BannerData
): Promise<void> => {
  const ctx = canvas.getContext('2d')!;
  const messages = birthdayMessages[data.language];

  // Navy background
  ctx.fillStyle = '#1a2744';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Saffron header stripe
  ctx.fillStyle = '#E8772E';
  ctx.fillRect(0, 0, canvas.width, 70);

  // Gold accent line
  ctx.fillStyle = '#F5A623';
  ctx.fillRect(0, 68, canvas.width, 3);

  // Load images
  const [karyakartaImg, politicianImg] = await Promise.all([
    loadImage(data.karyakartaPhoto),
    loadImage(data.politicianPhoto),
  ]);

  // Birthday title in header
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 30px "Noto Sans Devanagari", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(messages.title, canvas.width / 2, 48);

  // MIDDLE SECTION: Two photos side by side with text in center
  const photoY = 100;
  const photoWidth = 100;
  const photoHeight = 120;

  // Politician photo (left)
  drawRectImage(ctx, politicianImg, 30, photoY, photoWidth, photoHeight, 3, '#F5A623');

  // Politician info below photo
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.font = 'bold 12px "Noto Sans Devanagari", sans-serif';
  ctx.fillText(data.translatedPoliticianName || data.politicianName, 30 + photoWidth / 2, photoY + photoHeight + 20);
  ctx.font = '10px "Noto Sans Devanagari", sans-serif';
  ctx.fillStyle = '#F5A623';
  ctx.fillText(data.politicianPosition, 30 + photoWidth / 2, photoY + photoHeight + 35);

  // Karyakarta photo (right)
  drawRectImage(ctx, karyakartaImg, canvas.width - 30 - photoWidth, photoY, photoWidth, photoHeight, 3, '#E8772E');

  // CENTER: Karyakarta name and message
  const centerX = canvas.width / 2;

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 28px "Noto Sans Devanagari", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(data.translatedKaryakartaName || data.karyakartaName, centerX, 150);

  // Decorative line
  ctx.strokeStyle = '#F5A623';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX - 80, 165);
  ctx.lineTo(centerX + 80, 165);
  ctx.stroke();

  // Message
  ctx.font = '16px "Noto Sans Devanagari", sans-serif';
  ctx.fillStyle = '#F5A623';
  wrapText(ctx, messages.message, centerX, 195, 200, 22);

  // Bottom gold stripe
  ctx.fillStyle = '#F5A623';
  ctx.fillRect(0, canvas.height - 25, canvas.width, 25);

  ctx.fillStyle = '#1a2744';
  ctx.font = 'bold 12px "Noto Sans Devanagari", sans-serif';
  ctx.fillText(messages.from, canvas.width / 2, canvas.height - 8);
};

// Template 3: Minimal Premium - Clean centered layout
const drawMinimalPremium = async (
  canvas: HTMLCanvasElement,
  data: BannerData
): Promise<void> => {
  const ctx = canvas.getContext('2d')!;
  const messages = birthdayMessages[data.language];

  // White background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Elegant double border
  ctx.strokeStyle = '#1a2744';
  ctx.lineWidth = 6;
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

  ctx.strokeStyle = '#F5A623';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

  // Load images
  const [karyakartaImg, politicianImg] = await Promise.all([
    loadImage(data.karyakartaPhoto),
    loadImage(data.politicianPhoto),
  ]);

  // TOP SECTION: Birthday title
  ctx.fillStyle = '#1a2744';
  ctx.font = 'bold 34px "Noto Sans Devanagari", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(messages.title, canvas.width / 2, 65);

  // Decorative line under title
  ctx.strokeStyle = '#F5A623';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 100, 80);
  ctx.lineTo(canvas.width / 2 + 100, 80);
  ctx.stroke();

  // MIDDLE SECTION: Karyakarta photo and name
  const karyakartaRadius = 55;
  drawCircularImage(ctx, karyakartaImg, canvas.width / 2, 155, karyakartaRadius, 3, '#F5A623');

  ctx.font = 'bold 26px "Noto Sans Devanagari", sans-serif';
  ctx.fillStyle = '#E8772E';
  ctx.fillText(data.translatedKaryakartaName || data.karyakartaName, canvas.width / 2, 240);

  // Message
  ctx.fillStyle = '#666666';
  ctx.font = '15px "Noto Sans Devanagari", sans-serif';
  wrapText(ctx, messages.message, canvas.width / 2, 275, canvas.width - 100, 20);

  // BOTTOM SECTION: Politician info
  const bottomY = canvas.height - 55;
  const politicianRadius = 25;

  drawCircularImage(ctx, politicianImg, 70, bottomY, politicianRadius, 2, '#1a2744');

  ctx.fillStyle = '#1a2744';
  ctx.textAlign = 'left';
  ctx.font = 'bold 13px "Noto Sans Devanagari", sans-serif';
  ctx.fillText(data.translatedPoliticianName || data.politicianName, 105, bottomY - 5);
  ctx.font = '11px "Noto Sans Devanagari", sans-serif';
  ctx.fillStyle = '#888888';
  ctx.fillText(data.politicianPosition, 105, bottomY + 12);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#999999';
  ctx.font = '11px "Noto Sans Devanagari", sans-serif';
  ctx.fillText(messages.from, canvas.width - 40, bottomY + 3);
};

// Template 4: Festive - Celebration theme with clear sections
const drawFestive = async (
  canvas: HTMLCanvasElement,
  data: BannerData
): Promise<void> => {
  const ctx = canvas.getContext('2d')!;
  const messages = birthdayMessages[data.language];

  // Bright gradient background
  const gradient = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 0,
    canvas.width / 2, canvas.height / 2, canvas.width
  );
  gradient.addColorStop(0, '#FFF8E1');
  gradient.addColorStop(0.5, '#FFE0B2');
  gradient.addColorStop(1, '#FFCC80');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw confetti (keeping away from text areas)
  const colors = ['#E8772E', '#F5A623', '#1a2744', '#4CAF50', '#E91E63'];
  for (let i = 0; i < 25; i++) {
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.save();
    const x = Math.random() * canvas.width;
    const y = Math.random() * 60 + (Math.random() > 0.5 ? 0 : canvas.height - 60);
    ctx.translate(x, y);
    ctx.rotate(Math.random() * Math.PI);
    ctx.fillRect(-6, -2, 12, 4);
    ctx.restore();
  }

  // Load images
  const [karyakartaImg, politicianImg] = await Promise.all([
    loadImage(data.karyakartaPhoto),
    loadImage(data.politicianPhoto),
  ]);

  // TOP: Celebration banner ribbon
  ctx.fillStyle = '#E8772E';
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 160, 50);
  ctx.lineTo(canvas.width / 2 + 160, 50);
  ctx.lineTo(canvas.width / 2 + 140, 90);
  ctx.lineTo(canvas.width / 2 - 140, 90);
  ctx.closePath();
  ctx.fill();

  // Ribbon ends
  ctx.fillStyle = '#C55A1B';
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 160, 50);
  ctx.lineTo(canvas.width / 2 - 180, 70);
  ctx.lineTo(canvas.width / 2 - 160, 90);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 + 160, 50);
  ctx.lineTo(canvas.width / 2 + 180, 70);
  ctx.lineTo(canvas.width / 2 + 160, 90);
  ctx.closePath();
  ctx.fill();

  // Birthday title in ribbon
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 26px "Noto Sans Devanagari", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(messages.title, canvas.width / 2, 78);

  // MIDDLE: Two photos side by side
  const photoY = 130;

  // Karyakarta photo (center-left, larger)
  const karyakartaRadius = 60;
  drawCircularImage(ctx, karyakartaImg, canvas.width / 2 - 90, photoY + karyakartaRadius, karyakartaRadius, 4, '#F5A623');

  // Politician photo (center-right, smaller)
  const politicianRadius = 40;
  drawCircularImage(ctx, politicianImg, canvas.width / 2 + 90, photoY + karyakartaRadius + 20, politicianRadius, 3, '#E8772E');

  // RIGHT SIDE: Text content
  const textY = 280;

  // Karyakarta name
  ctx.fillStyle = '#1a2744';
  ctx.font = 'bold 28px "Noto Sans Devanagari", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(data.translatedKaryakartaName || data.karyakartaName, canvas.width / 2, textY);

  // Message
  ctx.font = '14px "Noto Sans Devanagari", sans-serif';
  ctx.fillStyle = '#555555';
  wrapText(ctx, messages.message, canvas.width / 2, textY + 30, canvas.width - 60, 18);

  // Bottom: Politician info
  ctx.fillStyle = '#777777';
  ctx.font = '11px "Noto Sans Devanagari", sans-serif';
  ctx.fillText(`${messages.from} ${data.translatedPoliticianName || data.politicianName}`, canvas.width / 2, canvas.height - 25);
  ctx.font = '10px "Noto Sans Devanagari", sans-serif';
  ctx.fillText(data.politicianPosition, canvas.width / 2, canvas.height - 10);
};

// Helper function to wrap text
const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) => {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  const align = ctx.textAlign;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[i] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
};

// Main banner generation function
export const generateBanner = async (
  templateId: TemplateId,
  data: BannerData
): Promise<HTMLCanvasElement> => {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 400;

  const templateFunctions = {
    'modern-gradient': drawModernGradient,
    'political-branding': drawPoliticalBranding,
    'minimal-premium': drawMinimalPremium,
    'festive': drawFestive,
  };

  await templateFunctions[templateId](canvas, data);

  return canvas;
};

// Download banner as image
export const downloadBanner = (canvas: HTMLCanvasElement, filename: string = 'birthday-banner.png'): void => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

// Get banner as data URL
export const getBannerDataUrl = (canvas: HTMLCanvasElement): string => {
  return canvas.toDataURL('image/png');
};
