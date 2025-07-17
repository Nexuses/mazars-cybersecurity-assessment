const { MongoClient } = require('mongodb');

async function cleanupAndPreventDuplicates() {
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

    // Step 1: Clean up existing duplicates
    console.log('\n🔍 Step 1: Finding and removing duplicate assessments...');
    const allAssessments = await collection.find({}).toArray();
    console.log(`Found ${allAssessments.length} total assessments`);

    // Group by email and environment to find duplicates
    const groupedAssessments = {};
    
    allAssessments.forEach(assessment => {
      const key = `${assessment.personalInfo.email}-${assessment.personalInfo.environmentUniqueName}`;
      if (!groupedAssessments[key]) {
        groupedAssessments[key] = [];
      }
      groupedAssessments[key].push(assessment);
    });

    let duplicatesRemoved = 0;

    // Process each group
    for (const [key, assessments] of Object.entries(groupedAssessments)) {
      if (assessments.length > 1) {
        console.log(`Found ${assessments.length} assessments for ${key}`);
        
        // Sort by creation date (keep the most recent)
        assessments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Keep the first (most recent) one, remove the rest
        const toRemove = assessments.slice(1);
        
        for (const assessment of toRemove) {
          await collection.deleteOne({ _id: assessment._id });
          duplicatesRemoved++;
          console.log(`Removed duplicate assessment: ${assessment._id}`);
        }
      }
    }

    console.log(`✅ Cleanup complete. Removed ${duplicatesRemoved} duplicate assessments.`);

    // Step 2: Create unique indexes to prevent future duplicates
    console.log('\n🔒 Step 2: Creating unique indexes to prevent future duplicates...');
    
    // Create a unique compound index on email and environmentUniqueName
    await collection.createIndex(
      {
        'personalInfo.email': 1,
        'personalInfo.environmentUniqueName': 1
      },
      {
        unique: true,
        name: 'email_environment_unique'
      }
    );
    console.log('✅ Created unique index on email + environment');

    // Also create an index on submissionId if it exists
    try {
      await collection.createIndex(
        { 'submissionId': 1 },
        {
          unique: true,
          sparse: true, // Only index documents that have submissionId field
          name: 'submissionId_unique'
        }
      );
      console.log('✅ Created unique index on submissionId');
    } catch (error) {
      console.log('ℹ️ SubmissionId index creation skipped (field may not exist yet)');
    }

    console.log('\n🎉 All done! Duplicate prevention is now active.');
    console.log('📝 The system will now prevent duplicate submissions for the same email + environment combination.');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('✅ Disconnected from MongoDB');
  }
}

cleanupAndPreventDuplicates().catch(console.error); 