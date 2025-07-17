const { MongoClient } = require('mongodb');

async function cleanupDuplicates() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI environment variable is not set');
    process.exit(1);
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const collection = db.collection('assessments');

    // Find all assessments
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

    console.log(`Cleanup complete. Removed ${duplicatesRemoved} duplicate assessments.`);

  } catch (error) {
    console.error('Error cleaning up duplicates:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

cleanupDuplicates().catch(console.error); 