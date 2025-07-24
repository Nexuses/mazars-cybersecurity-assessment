const { MongoClient } = require('mongodb');

// Test the improved MongoDB connection configuration
async function testMongoDBConnection() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('MONGODB_URI environment variable is not set');
    process.exit(1);
  }

  const options = {
    maxPoolSize: 50,
    minPoolSize: 5,
    maxIdleTimeMS: 30000,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    retryWrites: true,
    retryReads: true,
    w: 'majority',
    heartbeatFrequencyMS: 10000,
    serverApi: {
      version: '1',
      strict: true,
      deprecationErrors: true,
    }
  };

  console.log('Testing MongoDB connection with improved configuration...');
  console.log('Connection options:', JSON.stringify(options, null, 2));

  let client;
  try {
    // Test 1: Basic connection
    console.log('\n1. Testing basic connection...');
    client = new MongoClient(uri, options);
    
    // Add connection monitoring
    client.on('connected', () => {
      console.log('✅ MongoDB client connected');
    });

    client.on('disconnected', () => {
      console.log('⚠️ MongoDB client disconnected');
    });

    client.on('error', (error) => {
      console.error('❌ MongoDB client error:', error);
    });

    client.on('timeout', () => {
      console.warn('⏰ MongoDB client timeout');
    });

    await client.connect();
    console.log('✅ Basic connection successful');

    // Test 2: Database ping
    console.log('\n2. Testing database ping...');
    await client.db().admin().ping();
    console.log('✅ Database ping successful');

    // Test 3: Collection access
    console.log('\n3. Testing collection access...');
    const db = client.db();
    const collection = db.collection('assessments');
    const count = await collection.countDocuments();
    console.log(`✅ Collection access successful. Document count: ${count}`);

    // Test 4: Connection pool status
    console.log('\n4. Testing connection pool...');
    const poolStatus = await client.db().admin().serverStatus();
    console.log('✅ Connection pool status retrieved');

    // Test 5: Simulate connection reuse
    console.log('\n5. Testing connection reuse...');
    for (let i = 0; i < 3; i++) {
      const testCollection = client.db().collection('assessments');
      await testCollection.findOne();
      console.log(`✅ Connection reuse test ${i + 1} successful`);
    }

    console.log('\n🎉 All MongoDB connection tests passed!');
    console.log('The improved connection configuration should handle timeouts and reconnections better.');

  } catch (error) {
    console.error('❌ MongoDB connection test failed:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 MongoDB client closed');
    }
  }
}

// Run the test
testMongoDBConnection().catch(console.error); 