import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 50, // Increased from 10 to handle more concurrent connections
  minPoolSize: 5, // Keep minimum connections alive
  maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
  serverSelectionTimeoutMS: 10000, // Increased from 5000 to 10000ms
  socketTimeoutMS: 45000, // Keep existing socket timeout
  connectTimeoutMS: 10000, // Add explicit connection timeout
  retryWrites: true,
  retryReads: true, // Add retry for reads
  w: 'majority' as const,
  // Add heartbeat frequency to keep connections alive
  heartbeatFrequencyMS: 10000,
  // Add server monitoring
  serverApi: {
    version: '1' as const,
    strict: true,
    deprecationErrors: true,
  }
};

let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production, create a new client for each request to avoid connection pooling issues
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Add connection monitoring
if (client) {
  client.on('connected', () => {
    console.log('MongoDB client connected');
  });

  client.on('disconnected', () => {
    console.log('MongoDB client disconnected');
  });

  client.on('error', (error) => {
    console.error('MongoDB client error:', error);
  });

  client.on('timeout', () => {
    console.warn('MongoDB client timeout');
  });
}

// Robust connection utility with retry logic
export async function getMongoClient(maxRetries = 3, retryDelay = 1000): Promise<MongoClient> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const client = await Promise.race([
        clientPromise,
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('MongoDB connection timeout')), 15000)
        )
      ]);
      
      // Test the connection
      await client.db().admin().ping();
      return client;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown connection error');
      console.warn(`MongoDB connection attempt ${attempt} failed:`, lastError.message);
      
      if (attempt < maxRetries) {
        console.log(`Retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        retryDelay *= 2; // Exponential backoff
      }
    }
  }
  
  throw new Error(`Failed to connect to MongoDB after ${maxRetries} attempts. Last error: ${lastError?.message}`);
}

export default clientPromise;

// Admin user type
export interface AdminUser {
  email: string;
  password: string;
  name: string;
  createdAt: Date;
}

// Collection names
export const COLLECTIONS = {
  ASSESSMENTS: 'assessments',
  ADMIN_USERS: 'admin_users',
} as const; 