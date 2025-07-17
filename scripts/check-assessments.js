const { MongoClient } = require('mongodb');

async function checkAssessments() {
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

    // Display each assessment
    assessments.forEach((assessment, index) => {
      console.log(`\n--- Assessment ${index + 1} ---`);
      console.log(`ID: ${assessment._id}`);
      console.log(`Name: ${assessment.personalInfo?.name || 'N/A'}`);
      console.log(`Email: ${assessment.personalInfo?.email || 'N/A'}`);
      console.log(`Environment: ${assessment.personalInfo?.environmentUniqueName || 'N/A'}`);
      console.log(`Score: ${assessment.score || 'N/A'}`);
      console.log(`Created: ${assessment.createdAt || 'N/A'}`);
      console.log(`Has detailedAnswers: ${assessment.detailedAnswers ? 'Yes' : 'No'}`);
      console.log(`Has selectedCategories: ${assessment.selectedCategories ? 'Yes' : 'No'}`);
      console.log(`Has selectedAreas: ${assessment.selectedAreas ? 'Yes' : 'No'}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('✅ Disconnected from MongoDB');
  }
}

checkAssessments().catch(console.error); 