/** @type {import('next').NextConfig} */
const cspHeader = `
 default-src *;
    script-src * 'unsafe-eval' 'unsafe-inline';
    style-src * 'unsafe-inline';
    img-src * data: blob:;
    font-src *;
    object-src *;
    base-uri *;
    form-action *;
    frame-src *;
    media-src * data:;
    connect-src *;
`;

const nextConfig = {
  sassOptions: {
    legacy: true,
  },
  modularizeImports: {
    "@mui/material": {
      transform: "@mui/material/{{member}}"
    },
    "@mui/lab": {
      transform: "@mui/lab/{{member}}"
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com",
        pathname: "**"
      }
    ]
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, "")
          }
        ]
      }
    ];
  }
};

export default nextConfig;
