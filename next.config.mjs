/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        domains: [
            "res.cloudinary.com",
            "avatars.githubsercontent.com",
            "lh3.googleusercontent.com",
        ],
    },
};

export default nextConfig;
