import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  uri: process.env.MONGODB_URI,
  maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '10', 10),
  // TLS configuration for MongoDB Atlas compatibility
  tls: true,
  tlsAllowInvalidCertificates: false,
  tlsAllowInvalidHostnames: false,
  // Connection timeouts
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  // Retry configuration
  retryAttempts: 5,
  retryDelay: 3000,
}));
