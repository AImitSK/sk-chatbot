import { createClient } from "next-sanity";

export const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "v2024-01-01",  // Sanity's bevorzugtes Format
    token: process.env.SANITY_TOKEN, // Optional, nur für serverseitige Anfragen erforderlich
    useCdn: false, // Für schnelle Antwortzeiten im Entwicklung, auf true in Produktion setzen
});

// Debug-Logging, um sicherzustellen, dass die Umgebungsvariablen korrekt sind
console.log('Sanity Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
console.log('Sanity Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET);
console.log('Sanity API Version:', "v2024-01-01");
console.log('Sanity Token:', process.env.SANITY_TOKEN?.substring(0, 5) + '...');