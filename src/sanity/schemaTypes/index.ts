import { projekt } from './projekt';
import { vertragsmodelle } from './vertragsModell';
import { userType } from './userType';
import { Firmenadresse, TechnischerAnsprechpartner, buchhaltung } from './firma';
import { team } from './team'; // Team-Schema importieren
import { faq } from './faq'; // FAQ-Schema importieren

// Füge das FAQ-Schema zur Liste hinzu
export const schemaTypes = [
    vertragsmodelle,
    projekt,
    userType,
    Firmenadresse,
    TechnischerAnsprechpartner,
    buchhaltung,
    team,
    faq, // FAQ-Schema hinzugefügt
];