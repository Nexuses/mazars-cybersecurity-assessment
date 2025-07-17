const { MongoClient } = require('mongodb');

async function testAdminAPI() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://neeraj:forvis2025@cluster0.ggkwnt1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
  
  if (!uri) {
    console.error('MONGODB_URI environment variable is not set');
    process.exit(1);
  }

  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db();
    const collection = db.collection('assessments');

    // Simulate the API query
    console.log('\n🔍 Testing API query logic...');
    
    const query = {};
    const total = await collection.countDocuments(query);
    console.log(`📊 Total assessments in database: ${total}`);

    const assessments = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(0)
      .limit(10)
      .toArray();

    console.log(`📋 Retrieved ${assessments.length} assessments`);

    if (assessments.length > 0) {
      const firstAssessment = assessments[0];
      console.log('\n📋 First assessment details:');
      console.log(`- ID: ${firstAssessment._id}`);
      console.log(`- Name: ${firstAssessment.personalInfo?.name}`);
      console.log(`- Email: ${firstAssessment.personalInfo?.email}`);
      console.log(`- Environment: ${firstAssessment.personalInfo?.environmentUniqueName}`);
      console.log(`- Score: ${firstAssessment.score}`);
      console.log(`- Created: ${firstAssessment.createdAt}`);
      
      // Test the data transformation
      const processedAssessment = {
        ...firstAssessment,
        createdAt: firstAssessment.createdAt ? new Date(firstAssessment.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: firstAssessment.updatedAt ? new Date(firstAssessment.updatedAt).toISOString() : new Date().toISOString()
      };
      
      console.log('\n✅ Data transformation successful');
      console.log(`- Processed createdAt: ${processedAssessment.createdAt}`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('✅ Disconnected from MongoDB');
  }
}

testAdminAPI().catch(console.error); 