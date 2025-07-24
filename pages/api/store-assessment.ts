import type { NextApiRequest, NextApiResponse } from 'next';
import { getMongoClient } from '@/lib/mongodb';

// Define the enhanced structure of the request body
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
  selectedCategories: string[];
  selectedAreas: string[];
  answers: Record<string, string>;
  score: number;
  totalQuestions: number;
  completedQuestions: number;
  assessmentMetadata: {
    language: string;
    assessmentDate: string;
    assessmentDuration: number;
    userAgent: string;
    screenResolution: string;
  };
  questionDetails: Array<{
    id: string;
    text: string;
    category: string;
    area: string;
    topic: string;
    options: Array<{ value: string; label: string; score: number }>;
    selectedAnswer: string | null;
  }>;
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

    const { 
      personalInfo, 
      selectedCategories, 
      selectedAreas, 
      answers, 
      score, 
      totalQuestions, 
      completedQuestions, 
      assessmentMetadata, 
      questionDetails, 
      language = 'en' 
    } = req.body as AssessmentData;
    


    console.log('Attempting to connect to MongoDB...');
    // Get database connection with retry logic
    const client = await getMongoClient();
    const db = client.db();
    const collection = db.collection('assessments');

    console.log('Preparing enhanced assessment data...');
    // Prepare the comprehensive assessment data for storage
    const assessmentRecord = {
      personalInfo,
      selectedCategories,
      selectedAreas,
      answers,
      score,
      totalQuestions,
      completedQuestions,
      assessmentMetadata,
      questionDetails,
      language,
      // Add detailed question and answer mapping with enhanced information
      detailedAnswers: questionDetails.map((questionDetail) => {
        const answerValue = answers[questionDetail.id];
        const answer = questionDetail.options.find((opt) => opt.value === answerValue);
        return {
          questionId: questionDetail.id,
          questionText: questionDetail.text,
          answerValue: answerValue || null,
          answerLabel: answer?.label || 'Not answered',
          category: questionDetail.category,
          area: questionDetail.area,
          topic: questionDetail.topic
        };
      }),
      // Add a unique submission identifier to prevent duplicates
      submissionId: `${personalInfo.email}-${personalInfo.environmentUniqueName}-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('Inserting enhanced assessment into MongoDB...');
    
    // Check for potential duplicate submission (same email and environment)
    const existingSubmission = await collection.findOne({
      'personalInfo.email': personalInfo.email,
      'personalInfo.environmentUniqueName': personalInfo.environmentUniqueName
    });
    
    if (existingSubmission) {
      console.log('Duplicate submission detected for same email and environment, skipping...');
      return res.status(200).json({ 
        message: 'Assessment already submitted for this environment',
        assessmentId: existingSubmission._id,
        data: {
          score,
          totalQuestions,
          completedQuestions,
          selectedCategories: selectedCategories.length,
          selectedAreas: selectedAreas.length
        }
      });
    }
    
    // Insert the comprehensive assessment data into MongoDB
    const result = await collection.insertOne(assessmentRecord);

    console.log('Enhanced assessment stored in MongoDB with ID:', result.insertedId);

    res.status(200).json({ 
      message: 'Assessment stored successfully',
      assessmentId: result.insertedId,
      data: {
        score,
        totalQuestions,
        completedQuestions,
        selectedCategories: selectedCategories.length,
        selectedAreas: selectedAreas.length
      }
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