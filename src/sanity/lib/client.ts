// src/sanity/client.ts

import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId, sanityToken } from '@/sanity/env';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,  // Setze auf `false` für eine immer aktuelle Datenabfrage
  token: sanityToken,  // Dein Sanity API Token für private Anfragen
});
