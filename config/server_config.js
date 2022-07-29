const dev = process.env.NODE_ENV !== 'production';

let newURL = "https://" + process.env.NEXT_PUBLIC_VERCEL_URL

export const server = dev ? 'http://localhost:3000' : newURL;