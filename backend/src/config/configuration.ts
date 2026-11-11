export default () => ({
  admin: {
    username: process.env.ADMIN_USERNAME || 'philmar_admin',
    passwordHash: process.env.ADMIN_PASSWORD_HASH,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_change_me',
    expiry: process.env.JWT_EXPIRY || '24h',
  },
  paths: {
    frontend: process.env.FRONTEND_PATH || '../frontend/public',
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    secretKey: process.env.SUPABASE_SECRET_KEY,
    buckets: {
      images: process.env.SUPABASE_BUCKET_IMAGES || 'images',
      audio: process.env.SUPABASE_BUCKET_AUDIO || 'audio',
      documents: process.env.SUPABASE_BUCKET_DOCUMENTS || 'documents',
    },
  },
  contact: {
    turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY,
    brevoApiKey: process.env.BREVO_API_KEY,
    senderEmail: process.env.CONTACT_SENDER_EMAIL,
    recipientEmail: process.env.CONTACT_RECIPIENT_EMAIL,
  },
  stats: {
    // Secret partagé avec le site Next.js (variable STATS_INGEST_SECRET sur Render ET sur Vercel)
    ingestSecret: process.env.STATS_INGEST_SECRET,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  },
});
