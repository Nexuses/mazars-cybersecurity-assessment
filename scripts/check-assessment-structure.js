const { MongoClient } = require('mongodb');

async function checkAssessmentStructure() {
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

    // Get all assessments
    const assessments = await collection.find({}).toArray();
    console.log(`📊 Found ${assessments.length} assessments in database`);

    if (assessments.length === 0) {
      console.log('❌ No assessments found in database');
      return;
    }

    // Display the first assessment in detail
    const firstAssessment = assessments[0];
    console.log('\n📋 First Assessment Structure:');
    console.log(JSON.stringify(firstAssessment, null, 2));

    // Check for required fields
    console.log('\n🔍 Field Check:');
    console.log(`- _id: ${firstAssessment._id ? '✅' : '❌'}`);
    console.log(`- personalInfo: ${firstAssessment.personalInfo ? '✅' : '❌'}`);
    if (firstAssessment.personalInfo) {
      console.log(`  - name: ${firstAssessment.personalInfo.name ? '✅' : '❌'}`);
      console.log(`  - email: ${firstAssessment.personalInfo.email ? '✅' : '❌'}`);
      console.log(`  - environmentUniqueName: ${firstAssessment.personalInfo.environmentUniqueName ? '✅' : '❌'}`);
      console.log(`  - role: ${firstAssessment.personalInfo.role ? '✅' : '❌'}`);
      console.log(`  - date: ${firstAssessment.personalInfo.date ? '✅' : '❌'}`);
    }
    console.log(`- score: ${firstAssessment.score !== undefined ? '✅' : '❌'}`);
    console.log(`- selectedCategories: ${firstAssessment.selectedCategories ? '✅' : '❌'}`);
    console.log(`- selectedAreas: ${firstAssessment.selectedAreas ? '✅' : '❌'}`);
    console.log(`- createdAt: ${firstAssessment.createdAt ? '✅' : '❌'}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('✅ Disconnected from MongoDB');
  }
}

checkAssessmentStructure().catch(console.error); 