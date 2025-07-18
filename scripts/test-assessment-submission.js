const { MongoClient } = require('mongodb');

async function testAssessmentSubmission() {
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

    // Create a test assessment
    const testAssessment = {
      personalInfo: {
        name: "Test User",
        date: "2025-01-20",
        role: "IT Manager",
        environmentType: "Production",
        environmentSize: "Medium",
        environmentImportance: "High",
        environmentMaturity: "Intermediate",
        environmentUniqueName: "test-environment-2025",
        marketSector: "Technology",
        country: "United States",
        email: "test@example.com"
      },
      selectedCategories: ["Governance", "Risk Management"],
      selectedAreas: ["Access Control", "Data Protection"],
      answers: {
        "q1": "3",
        "q2": "4",
        "q3": "2"
      },
      score: 75,
      totalQuestions: 3,
      completedQuestions: 3,
      assessmentMetadata: {
        language: "en",
        assessmentDate: "2025-01-20T10:00:00Z",
        assessmentDuration: 300,
        userAgent: "Test Browser",
        screenResolution: "1920x1080"
      },
      questionDetails: [
        {
          id: "q1",
          text: "Test Question 1",
          category: "Governance",
          area: "Access Control",
          topic: "Authentication",
          options: [
            { value: "1", label: "Poor", score: 1 },
            { value: "2", label: "Fair", score: 2 },
            { value: "3", label: "Good", score: 3 },
            { value: "4", label: "Excellent", score: 4 }
          ],
          selectedAnswer: "3"
        }
      ],
      detailedAnswers: [
        {
          questionId: "q1",
          questionText: "Test Question 1",
          answerValue: "3",
          answerLabel: "Good",
          category: "Governance",
          area: "Access Control",
          topic: "Authentication"
        }
      ],
      submissionId: `test@example.com-test-environment-2025-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('📝 Inserting test assessment...');
    const result = await collection.insertOne(testAssessment);
    console.log('✅ Test assessment inserted with ID:', result.insertedId);

    // Verify the assessment was stored
    const storedAssessment = await collection.findOne({ _id: result.insertedId });
    if (storedAssessment) {
      console.log('✅ Assessment verified in database');
      console.log('📊 Assessment details:');
      console.log(`  - Name: ${storedAssessment.personalInfo.name}`);
      console.log(`  - Email: ${storedAssessment.personalInfo.email}`);
      console.log(`  - Environment: ${storedAssessment.personalInfo.environmentUniqueName}`);
      console.log(`  - Score: ${storedAssessment.score}`);
      console.log(`  - Created: ${storedAssessment.createdAt}`);
    } else {
      console.log('❌ Assessment not found in database');
    }

    // Get total count
    const totalAssessments = await collection.countDocuments({});
    console.log(`📈 Total assessments in database: ${totalAssessments}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('✅ Disconnected from MongoDB');
  }
}

testAssessmentSubmission(); 