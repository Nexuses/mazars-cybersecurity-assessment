# MongoDB Integration Setup

This guide explains how to set up MongoDB integration for storing cybersecurity assessment responses.

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://neeraj:<db_password>@mazars-cybersecurity-as.hmcgxcg.mongodb.net/?retryWrites=true&w=majority&appName=mazars-cybersecurity-assessment

# Existing SMTP Configuration
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
FROM_EMAIL=your-from-email@domain.com
TO_EMAIL=your-to-email@domain.com
```

## Database Structure

The MongoDB collection `assessments` will store the following structure:

```javascript
{
  _id: ObjectId,
  personalInfo: {
    name: string,
    date: string,
    role: string,
    environmentType: string,
    environmentSize: string,
    environmentImportance: string,
    environmentMaturity: string,
    environmentUniqueName: string,
    marketSector: string,
    country: string,
    email: string
  },
  answers: Record<string, string>,
  score: number,
  language: 'en' | 'fr',
  detailedAnswers: [
    {
      questionId: string,
      questionText: string,
      answerValue: string,
      answerLabel: string,
      category: string
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

1. **POST /api/store-assessment** - Stores assessment data in MongoDB
2. **POST /api/send-assessment** - Sends email and stores in MongoDB (updated)

## Features

- ✅ Automatic MongoDB storage when assessments are completed
- ✅ Detailed question and answer mapping
- ✅ Timestamp tracking
- ✅ Error handling with graceful fallback
- ✅ Development and production environment support

## Testing

To test the MongoDB integration:

1. Ensure your `.env.local` file is configured with the correct MongoDB URI
2. Complete a cybersecurity assessment
3. Check the console logs for MongoDB storage confirmation
4. Verify data is stored in your MongoDB database 