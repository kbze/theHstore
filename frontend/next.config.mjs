/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'production'
            ? 'https://thehstore-8876687551.europe-west1.run.app'
            : 'http://localhost:5000',
    },
};

export default nextConfig;
