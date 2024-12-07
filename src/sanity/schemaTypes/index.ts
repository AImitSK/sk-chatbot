import { projekt } from './projekt';
import { vertragsmodelle } from './vertragsModell';
import { userType } from './userType';
import { Firmenadresse, TechnischerAnsprechpartner, buchhaltung } from './firma';

// Füge das User-Schema zur Liste hinzu
export const schemaTypes = [
    vertragsmodelle,
    projekt,
    userType,
    Firmenadresse,
    TechnischerAnsprechpartner,
    buchhaltung
];