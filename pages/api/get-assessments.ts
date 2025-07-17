import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise, { COLLECTIONS } from '@/lib/mongodb';
import { Filter } from 'mongodb';

interface Assessment {
  personalInfo: {
    email: string;
    environmentUniqueName: string;
  };
  createdAt: Date;
  updatedAt?: Date;
  score: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { limit = 10, skip = 0, email = '', environmentName = '', dateFrom = '', dateTo = '' } = req.query;

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection<Assessment>(COLLECTIONS.ASSESSMENTS);

    // Build query filters
    const query: Filter<Assessment> = {};
    if (email) {
      query['personalInfo.email'] = { $regex: email as string, $options: 'i' };
    }
    if (environmentName) {
      query['personalInfo.environmentUniqueName'] = { $regex: environmentName as string, $options: 'i' };
    }
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) {
        query.createdAt.$gte = new Date(dateFrom as string);
      }
      if (dateTo) {
        query.createdAt.$lte = new Date(dateTo as string);
      }
    }

    // Get total count for pagination
    const total = await collection.countDocuments(query);

    // Get assessments with pagination
    const assessments = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit))
      .toArray();

    // Convert Date objects to strings for frontend compatibility
    const processedAssessments = assessments.map(assessment => ({
      ...assessment,
      createdAt: assessment.createdAt ? new Date(assessment.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: assessment.updatedAt ? new Date(assessment.updatedAt).toISOString() : new Date().toISOString()
    }));

    // Calculate statistics
    const allScores = await collection.find({}).project({ score: 1 }).toArray();
    const scores = allScores.map(a => a.score);
    const statistics = {
      totalAssessments: total,
      averageScore: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0,
      minScore: scores.length > 0 ? Math.min(...scores) : 0,
      maxScore: scores.length > 0 ? Math.max(...scores) : 0,
    };

    res.status(200).json({
      assessments: processedAssessments,
      pagination: {
        total,
        limit: Number(limit),
        skip: Number(skip),
        hasMore: total > (Number(skip) + Number(limit))
      },
      statistics
    });
  } catch (error) {
    console.error('Error retrieving assessments:', error);
    res.status(500).json({ 
      message: 'Error retrieving assessments',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 