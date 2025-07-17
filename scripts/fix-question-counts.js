const { MongoClient } = require('mongodb');

async function fixQuestionCounts() {
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

    // Fix each assessment
    for (const assessment of assessments) {
      console.log(`\n🔧 Fixing assessment: ${assessment._id}`);
      console.log(`Name: ${assessment.personalInfo?.name}`);
      
      // Calculate correct counts
      const answers = assessment.answers || {};
      const answerKeys = Object.keys(answers);
      const actualCompletedQuestions = answerKeys.length;
      
      const questionDetails = assessment.questionDetails || [];
      const actualTotalQuestions = questionDetails.length;
      
      console.log(`📝 Current stored values:`);
      console.log(`  - totalQuestions: ${assessment.totalQuestions}`);
      console.log(`  - completedQuestions: ${assessment.completedQuestions}`);
      
      console.log(`📝 Actual calculated values:`);
      console.log(`  - actualTotalQuestions: ${actualTotalQuestions}`);
      console.log(`  - actualCompletedQuestions: ${actualCompletedQuestions}`);
      
      // Update the assessment with correct counts
      const updateResult = await collection.updateOne(
        { _id: assessment._id },
        {
          $set: {
            totalQuestions: actualTotalQuestions,
            completedQuestions: actualCompletedQuestions,
            updatedAt: new Date()
          }
        }
      );
      
      if (updateResult.modifiedCount > 0) {
        console.log(`✅ Updated assessment with correct question counts`);
      } else {
        console.log(`ℹ️  No changes needed for this assessment`);
      }
    }

    console.log('\n🎉 Question count fix completed!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('✅ Disconnected from MongoDB');
  }
}

fixQuestionCounts().catch(console.error); 