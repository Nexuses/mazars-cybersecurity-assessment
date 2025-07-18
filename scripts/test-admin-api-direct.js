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

    // Get all assessments (simulating the admin API)
    console.log('📊 Fetching all assessments...');
    const assessments = await collection
      .find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    console.log(`📈 Found ${assessments.length} assessments`);

    // Process assessments like the API does
    const processedAssessments = assessments.map(assessment => ({
      ...assessment,
      createdAt: assessment.createdAt ? new Date(assessment.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: assessment.updatedAt ? new Date(assessment.updatedAt).toISOString() : new Date().toISOString()
    }));

    // Calculate statistics
    const allScores = await collection.find({}).project({ score: 1 }).toArray();
    const scores = allScores.map(a => a.score);
    const statistics = {
      totalAssessments: assessments.length,
      averageScore: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0,
      minScore: scores.length > 0 ? Math.min(...scores) : 0,
      maxScore: scores.length > 0 ? Math.max(...scores) : 0,
    };

    console.log('📊 Statistics:', statistics);

    // Show first few assessments
    console.log('\n📋 Recent assessments:');
    processedAssessments.slice(0, 3).forEach((assessment, index) => {
      console.log(`\n--- Assessment ${index + 1} ---`);
      console.log(`ID: ${assessment._id}`);
      console.log(`Name: ${assessment.personalInfo?.name || 'N/A'}`);
      console.log(`Email: ${assessment.personalInfo?.email || 'N/A'}`);
      console.log(`Environment: ${assessment.personalInfo?.environmentUniqueName || 'N/A'}`);
      console.log(`Score: ${assessment.score || 'N/A'}`);
      console.log(`Created: ${assessment.createdAt}`);
      console.log(`Has detailedAnswers: ${assessment.detailedAnswers ? 'Yes' : 'No'}`);
    });

    console.log('\n✅ Admin API simulation completed successfully');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('✅ Disconnected from MongoDB');
  }
}

testAdminAPI(); 