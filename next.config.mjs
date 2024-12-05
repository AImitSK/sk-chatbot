/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
        SANITY_API_VERSION: process.env.SANITY_API_VERSION,
        SANITY_TOKEN: process.env.SANITY_TOKEN,
    },
}

export default nextConfig
