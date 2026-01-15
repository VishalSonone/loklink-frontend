import { Karyakarta } from '@/types';

export const getLocalizedName = (karyakarta: Karyakarta, language: string): string => {
    if (language === 'hi' && karyakarta.nameHi) return karyakarta.nameHi;
    if (language === 'mr' && karyakarta.nameMr) return karyakarta.nameMr;
    return karyakarta.name;
};
