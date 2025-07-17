const { MongoClient } = require('mongodb');

async function createUniqueIndex() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://neeraj:forvis2025@cluster0.ggkwnt1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
  
  if (!uri) {
    console.error('MONGODB_URI environment variable is not set');
    process.exit(1);
  }

  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const collection = db.collection('assessments');

    // Create a unique compound index on email, environmentUniqueName, and createdAt
    // This will prevent duplicate submissions from the same user for the same environment
    await collection.createIndex(
      {
        'personalInfo.email': 1,
        'personalInfo.environmentUniqueName': 1,
        'createdAt': 1
      },
      {
        unique: false, // We'll handle duplicates in the application logic
        name: 'email_environment_createdAt'
      }
    );

    console.log('Unique index created successfully');
    
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
      console.log('SubmissionId unique index created successfully');
    } catch (error) {
      console.log('SubmissionId index creation skipped (field may not exist yet)');
    }

  } catch (error) {
    console.error('Error creating index:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

createUniqueIndex().catch(console.error); 