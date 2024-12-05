import { createClient } from "next-sanity";

export const client = createClient({
    projectId: "tq0dpgwf",
    dataset: "production",
    apiVersion: "2024-01-01",
    useCdn: false,
});


console.log('Sanity Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
console.log('Sanity Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET)
console.log('Sanity API Version:', process.env.SANITY_API_VERSION)
console.log('Sanity Token:', process.env.SANITY_TOKEN)
