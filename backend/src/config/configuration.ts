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
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  },
});
