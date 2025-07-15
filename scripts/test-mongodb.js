const { MongoClient } = require('mongodb');

async function testConnection() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://neeraj:forvis2025@cluster0.ggkwnt1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
  
  if (!uri) {
    console.error('❌ MONGODB_URI environment variable is not set');
    return;
  }

  try {
    console.log('🔌 Testing MongoDB connection...');
    
    const client = new MongoClient(uri);
    await client.connect();
    
    console.log('✅ Successfully connected to MongoDB');
    
    const db = client.db();
    const collections = await db.listCollections().toArray();
    console.log('📊 Available collections:', collections.map(c => c.name));
    
    // Test creating a collection
    const testCollection = db.collection('test');
    const result = await testCollection.insertOne({
      test: true,
      timestamp: new Date(),
      message: 'MongoDB connection test successful'
    });
    
    console.log('✅ Test document inserted with ID:', result.insertedId);
    
    // Clean up test document
    await testCollection.deleteOne({ _id: result.insertedId });
    console.log('🧹 Test document cleaned up');
    
    await client.close();
    console.log('✅ MongoDB connection test completed successfully');
    
  } catch (error) {
    console.error('❌ MongoDB connection test failed:', error.message);
    process.exit(1);
  }
}

testConnection(); 