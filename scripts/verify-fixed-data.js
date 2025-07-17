const { MongoClient } = require('mongodb');

async function verifyFixedData() {
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

    // Verify each assessment
    assessments.forEach((assessment, index) => {
      console.log(`\n--- Assessment ${index + 1} ---`);
      console.log(`ID: ${assessment._id}`);
      console.log(`Name: ${assessment.personalInfo?.name}`);
      
      // Calculate actual counts
      const answers = assessment.answers || {};
      const answerKeys = Object.keys(answers);
      const actualCompletedQuestions = answerKeys.length;
      
      const questionDetails = assessment.questionDetails || [];
      const actualTotalQuestions = questionDetails.length;
      
      console.log(`📝 Stored values:`);
      console.log(`  - totalQuestions: ${assessment.totalQuestions}`);
      console.log(`  - completedQuestions: ${assessment.completedQuestions}`);
      
      console.log(`📝 Actual counts:`);
      console.log(`  - actualTotalQuestions: ${actualTotalQuestions}`);
      console.log(`  - actualCompletedQuestions: ${actualCompletedQuestions}`);
      
      // Check if they match
      const totalMatch = assessment.totalQuestions === actualTotalQuestions;
      const completedMatch = assessment.completedQuestions === actualCompletedQuestions;
      
      console.log(`✅ Total questions match: ${totalMatch ? 'YES' : 'NO'}`);
      console.log(`✅ Completed questions match: ${completedMatch ? 'YES' : 'NO'}`);
      
      if (!totalMatch || !completedMatch) {
        console.log(`⚠️  MISMATCH DETECTED - Data needs to be fixed`);
      } else {
        console.log(`✅ All counts are correct`);
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('✅ Disconnected from MongoDB');
  }
}

verifyFixedData().catch(console.error); 