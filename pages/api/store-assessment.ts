import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { questionsData } from '@/lib/questions';

// Define the structure of the request body
interface AssessmentData {
  personalInfo: {
    name: string;
    date: string;
    role: string;
    environmentType: string;
    environmentSize: string;
    environmentImportance: string;
    environmentMaturity: string;
    environmentUniqueName: string;
    marketSector: string;
    country: string;
    email: string;
  };
  answers: Record<string, string>;
  score: number;
  language?: 'en' | 'fr';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Log environment check
    console.log('Checking environment variables...');
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not configured');
    }

    const { personalInfo, answers, score, language = 'en' } = req.body as AssessmentData;
    const currentQuestions = questionsData[language as keyof typeof questionsData];

    console.log('Attempting to connect to MongoDB...');
    // Get database connection
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('assessments');

    console.log('Preparing assessment data...');
    // Prepare the assessment data for storage
    const assessmentRecord = {
      personalInfo,
      answers,
      score,
      language,
      // Add detailed question and answer mapping
      detailedAnswers: Object.entries(answers).map(([questionId, answerValue]) => {
        const question = currentQuestions.find((q) => q.id === questionId);
        const answer = question?.options.find((opt) => opt.value === answerValue);
        return {
          questionId,
          questionText: question?.text || 'Unknown question',
          answerValue,
          answerLabel: answer?.label || 'Unknown answer',
          category: question?.category || 'Unknown'
        };
      }),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('Inserting assessment into MongoDB...');
    // Insert the assessment data into MongoDB
    const result = await collection.insertOne(assessmentRecord);

    console.log('Assessment stored in MongoDB with ID:', result.insertedId);

    res.status(200).json({ 
      message: 'Assessment stored successfully',
      assessmentId: result.insertedId
    });

  } catch (error) {
    console.error('Detailed error in store-assessment:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      mongodbUri: process.env.MONGODB_URI ? 'Configured' : 'Missing',
      nodeEnv: process.env.NODE_ENV
    });
    
    res.status(500).json({ 
      message: 'Failed to store assessment',
      error: error instanceof Error ? error.message : 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
} 