import { Politician, Karyakarta, WhatsAppLog } from '@/types';

const STORAGE_KEYS = {
  POLITICIAN: 'politician',
  KARYAKARTAS: 'karyakartas',
  WHATSAPP_LOGS: 'whatsappLogs',
  IS_LOGGED_IN: 'isLoggedIn',
  REGISTERED_POLITICIANS: 'registeredPoliticians',
};

// Default politician data
const defaultPolitician: Politician = {
  id: '1',
  name: 'Shri Rajesh Kumar',
  email: 'demo@example.com',
  password: 'password123',
  position: 'Member of Legislative Assembly',
  photo: '',
  defaultLanguage: 'en',
};

// Get today's date in MM-DD format for birthday matching
const getTodayMMDD = (): string => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${month}-${day}`;
};

// Generate sample karyakartas with one having today's birthday
const generateSampleKaryakartas = (): Karyakarta[] => {
  const today = new Date();
  const todayFormatted = today.toISOString().split('T')[0];

  return [
    {
      id: '1',
      name: 'Amit Sharma',
      nameHi: 'अमित शर्मा',
      nameMr: 'अमित शर्मा',
      whatsapp: '+919876543210',
      dob: todayFormatted, // Today's birthday!
      photo: '',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Priya Patel',
      nameHi: 'प्रिया पटेल',
      nameMr: 'प्रिया पटेल',
      whatsapp: '+919876543211',
      dob: '1990-06-15',
      photo: '',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Rahul Deshmukh',
      nameHi: 'राहुल देशमुख',
      nameMr: 'राहुल देशमुख',
      whatsapp: '+919876543212',
      dob: '1985-12-25',
      photo: '',
      createdAt: new Date().toISOString(),
    },
  ];
};

// Initialize demo data on first load
export const initializeDemoData = (): void => {
  if (!localStorage.getItem(STORAGE_KEYS.POLITICIAN)) {
    localStorage.setItem(STORAGE_KEYS.POLITICIAN, JSON.stringify(defaultPolitician));
  }

  const storedKaryakartas = localStorage.getItem(STORAGE_KEYS.KARYAKARTAS);
  if (!storedKaryakartas) {
    localStorage.setItem(STORAGE_KEYS.KARYAKARTAS, JSON.stringify(generateSampleKaryakartas()));
  } else {
    // Migration check: If stored data is missing localized names (legacy data), update it
    try {
      const parsed = JSON.parse(storedKaryakartas);
      if (parsed.length > 0 && !parsed[0].nameHi) {
        console.log('Migrating legacy karyakarta data to localized format...');
        localStorage.setItem(STORAGE_KEYS.KARYAKARTAS, JSON.stringify(generateSampleKaryakartas()));
      }
    } catch (e) {
      console.error('Error migrating data', e);
    }
  }

  if (!localStorage.getItem(STORAGE_KEYS.WHATSAPP_LOGS)) {
    localStorage.setItem(STORAGE_KEYS.WHATSAPP_LOGS, JSON.stringify([]));
  }
};

// Auth functions
export const register = (politicianData: Omit<Politician, 'id'>): Politician => {
  const politicians = getRegisteredPoliticians();
  const newPolitician: Politician = {
    ...politicianData,
    id: Date.now().toString(),
  };

  politicians.push(newPolitician);
  localStorage.setItem(STORAGE_KEYS.REGISTERED_POLITICIANS, JSON.stringify(politicians));

  // Also set as current politician and login
  localStorage.setItem(STORAGE_KEYS.POLITICIAN, JSON.stringify(newPolitician));
  localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');

  return newPolitician;
};

export const getRegisteredPoliticians = (): Politician[] => {
  const data = localStorage.getItem(STORAGE_KEYS.REGISTERED_POLITICIANS);
  return data ? JSON.parse(data) : [defaultPolitician];
};

export const login = (email?: string, password?: string): boolean => {
  if (!email || !password) {
    // Demo login for backward compatibility if needed, but we'll use proper login now
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
    return true;
  }

  const politicians = getRegisteredPoliticians();
  const politician = politicians.find(p => p.email === email && p.password === password);

  if (politician) {
    localStorage.setItem(STORAGE_KEYS.POLITICIAN, JSON.stringify(politician));
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
    return true;
  }

  return false;
};

export const logout = (): void => {
  localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'false');
};

export const isLoggedIn = (): boolean => {
  return localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true';
};

// Politician functions
export const getPolitician = (): Politician => {
  const data = localStorage.getItem(STORAGE_KEYS.POLITICIAN);
  return data ? JSON.parse(data) : defaultPolitician;
};

export const updatePolitician = (politician: Politician): void => {
  localStorage.setItem(STORAGE_KEYS.POLITICIAN, JSON.stringify(politician));
};

// Karyakarta functions
export const getKaryakartas = (): Karyakarta[] => {
  const data = localStorage.getItem(STORAGE_KEYS.KARYAKARTAS);
  return data ? JSON.parse(data) : [];
};

export const addKaryakarta = (karyakarta: Omit<Karyakarta, 'id' | 'createdAt'>): Karyakarta => {
  const karyakartas = getKaryakartas();
  const newKaryakarta: Karyakarta = {
    ...karyakarta,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  karyakartas.push(newKaryakarta);
  localStorage.setItem(STORAGE_KEYS.KARYAKARTAS, JSON.stringify(karyakartas));
  return newKaryakarta;
};

export const updateKaryakarta = (id: string, updates: Partial<Karyakarta>): Karyakarta | null => {
  const karyakartas = getKaryakartas();
  const index = karyakartas.findIndex((k) => k.id === id);
  if (index === -1) return null;

  karyakartas[index] = { ...karyakartas[index], ...updates };
  localStorage.setItem(STORAGE_KEYS.KARYAKARTAS, JSON.stringify(karyakartas));
  return karyakartas[index];
};

export const deleteKaryakarta = (id: string): boolean => {
  const karyakartas = getKaryakartas();
  const filtered = karyakartas.filter((k) => k.id !== id);
  if (filtered.length === karyakartas.length) return false;

  localStorage.setItem(STORAGE_KEYS.KARYAKARTAS, JSON.stringify(filtered));
  return true;
};

export const getTodaysBirthdays = (): Karyakarta[] => {
  const karyakartas = getKaryakartas();
  const todayMMDD = getTodayMMDD();

  return karyakartas.filter((k) => {
    const dobMMDD = k.dob.substring(5); // Get MM-DD from YYYY-MM-DD
    return dobMMDD === todayMMDD;
  });
};

// WhatsApp logs functions
export const getWhatsAppLogs = (): WhatsAppLog[] => {
  const data = localStorage.getItem(STORAGE_KEYS.WHATSAPP_LOGS);
  return data ? JSON.parse(data) : [];
};

export const addWhatsAppLog = (log: Omit<WhatsAppLog, 'id' | 'timestamp'>): WhatsAppLog => {
  const logs = getWhatsAppLogs();
  const newLog: WhatsAppLog = {
    ...log,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
  };
  logs.unshift(newLog); // Add to beginning
  localStorage.setItem(STORAGE_KEYS.WHATSAPP_LOGS, JSON.stringify(logs));
  return newLog;
};

export const clearWhatsAppLogs = (): void => {
  localStorage.setItem(STORAGE_KEYS.WHATSAPP_LOGS, JSON.stringify([]));
};
