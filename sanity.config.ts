'use client'

/**
 * This configuration is used for the Sanity Studio that’s mounted on the `\src\app\studio\[[...tool]]\page.tsx` route
 */

import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from '@/sanity/env';
import { schemaTypes } from '@/sanity/schemaTypes'; // Make sure this import is correct
import { structure } from '@/sanity/structure';

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  // Use schemaTypes to define your content schema
  schema: {
    types: schemaTypes, // Correctly reference schemaTypes here
  },
  plugins: [
    structureTool({ structure }),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});