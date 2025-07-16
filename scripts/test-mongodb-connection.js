const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function testMongoDBConnection() {
  console.log('🔍 Testing MongoDB Connection...');
  
  // Check if MONGODB_URI is set
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is not set');
    console.log('📝 Please add MONGODB_URI to your .env.local file');
    return;
  }

  console.log('✅ MONGODB_URI is configured');
  
  // Parse the URI to check format
  const uri = process.env.MONGODB_URI;
  console.log('🔗 URI format check:', uri.substring(0, 50) + '...');

  try {
    // Test connection with timeout
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    });

    console.log('🔄 Attempting to connect...');
    await client.connect();
    console.log('✅ Successfully connected to MongoDB!');

    // Test database access
    const db = client.db();
    console.log('📊 Database name:', db.databaseName);

    // Test collection access
    const collection = db.collection('assessments');
    console.log('📋 Collection "assessments" is accessible');

    // Test a simple query
    const count = await collection.countDocuments();
    console.log(`📈 Current assessment count: ${count}`);

    await client.close();
    console.log('✅ Connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n🔧 Troubleshooting DNS issues:');
      console.log('1. Check your internet connection');
      console.log('2. Verify the MongoDB Atlas cluster is active');
      console.log('3. Ensure the connection string is correct');
      console.log('4. Try using a different DNS server');
    }
    
    if (error.message.includes('Authentication failed')) {
      console.log('\n🔧 Troubleshooting authentication:');
      console.log('1. Check username and password in connection string');
      console.log('2. Ensure the user has proper permissions');
      console.log('3. Verify the database name is correct');
    }
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n🔧 Troubleshooting connection issues:');
      console.log('1. Check if MongoDB Atlas is accessible');
      console.log('2. Verify IP whitelist settings');
      console.log('3. Check firewall settings');
    }
  }
}

// Alternative connection string formats to try
function suggestAlternativeFormats() {
  console.log('\n📝 Alternative connection string formats to try:');
  console.log('1. Direct connection: mongodb://username:password@host:port/database');
  console.log('2. Atlas connection: mongodb+srv://username:password@cluster.mongodb.net/database');
  console.log('3. With options: mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority');
}

testMongoDBConnection().then(() => {
  suggestAlternativeFormats();
}).catch(console.error); 