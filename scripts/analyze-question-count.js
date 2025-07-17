const { MongoClient } = require('mongodb');

async function analyzeQuestionCount() {
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

    // Analyze each assessment
    assessments.forEach((assessment, index) => {
      console.log(`\n--- Assessment ${index + 1} ---`);
      console.log(`ID: ${assessment._id}`);
      console.log(`Name: ${assessment.personalInfo?.name}`);
      
      // Analyze answers
      const answers = assessment.answers || {};
      const answerKeys = Object.keys(answers);
      console.log(`📝 Total answers in 'answers' object: ${answerKeys.length}`);
      console.log(`📝 Answer keys: ${answerKeys.join(', ')}`);
      
      // Analyze detailedAnswers
      const detailedAnswers = assessment.detailedAnswers || [];
      console.log(`📝 Total detailedAnswers: ${detailedAnswers.length}`);
      
      // Analyze questionDetails
      const questionDetails = assessment.questionDetails || [];
      console.log(`📝 Total questionDetails: ${questionDetails.length}`);
      
      // Check stored counts
      console.log(`📊 Stored totalQuestions: ${assessment.totalQuestions}`);
      console.log(`📊 Stored completedQuestions: ${assessment.completedQuestions}`);
      
      // Calculate actual counts
      const actualTotalAnswers = answerKeys.length;
      const actualDetailedAnswers = detailedAnswers.length;
      const actualQuestionDetails = questionDetails.length;
      
      console.log(`\n🔍 Analysis:`);
      console.log(`- Answers object has ${actualTotalAnswers} questions`);
      console.log(`- DetailedAnswers has ${actualDetailedAnswers} questions`);
      console.log(`- QuestionDetails has ${actualQuestionDetails} questions`);
      console.log(`- Stored totalQuestions: ${assessment.totalQuestions}`);
      console.log(`- Stored completedQuestions: ${assessment.completedQuestions}`);
      
      // Check for discrepancies
      if (actualTotalAnswers !== assessment.totalQuestions) {
        console.log(`⚠️  DISCREPANCY: Answers count (${actualTotalAnswers}) != totalQuestions (${assessment.totalQuestions})`);
      }
      
      if (actualDetailedAnswers !== assessment.completedQuestions) {
        console.log(`⚠️  DISCREPANCY: DetailedAnswers count (${actualDetailedAnswers}) != completedQuestions (${assessment.completedQuestions})`);
      }
      
      // Show first few detailed answers
      if (detailedAnswers.length > 0) {
        console.log(`\n📋 First 3 detailed answers:`);
        detailedAnswers.slice(0, 3).forEach((answer, i) => {
          console.log(`  ${i + 1}. ${answer.questionText?.substring(0, 50)}...`);
        });
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('✅ Disconnected from MongoDB');
  }
}

analyzeQuestionCount().catch(console.error); 