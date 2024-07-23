/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		"remotePatterns": [{"hostname": "static-00.iconduck.com"}, {"hostname": "www.svgrepo.com"}]
	}
};

export default nextConfig;
