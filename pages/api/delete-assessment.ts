import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise, { COLLECTIONS } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Assessment ID is required' });
    }

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection(COLLECTIONS.ASSESSMENTS);

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid assessment ID format' });
    }

    // Delete the assessment
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    res.status(200).json({ 
      message: 'Assessment deleted successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting assessment:', error);
    res.status(500).json({ 
      message: 'Error deleting assessment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 