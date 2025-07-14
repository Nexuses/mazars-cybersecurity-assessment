import type { NextApiRequest, NextApiResponse } from 'next';
import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf, Image } from '@react-pdf/renderer';
import { translations } from '@/lib/translations';
import { questionsData } from '@/lib/questions';

// Add language parameter to the request body type
interface RequestBody {
  personalInfo: PersonalInfo;
  score: number;
  answers: Record<string, string>;
  questions: Question[];
  language: 'en' | 'fr';
}

// Add this interface at the top of the file
interface PersonalInfo {
  name: string;
  email: string;
  company: string;
  position: string;
}

// Add these types
type Question = {
  id: string;
  text: string;
  options: Array<{ value: string; label: string }>;
};

// Add getResultText function
const getResultText = (score: number, language: 'en' | 'fr' = 'en') => {
  const t = translations[language] || translations.en;
  if (score >= 85) return t.resultTexts.advanced;
  if (score >= 65) return t.resultTexts.solid;
  if (score >= 35) return t.resultTexts.basic;
  return t.resultTexts.urgent;
};

// Create styles for the PDF
const createStyles = () => StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '50%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f2f2f2',
    padding: 8,
  },
  tableCol: {
    width: '50%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
  },
  tableCellHeader: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  tableCell: {
    fontSize: 10,
    textAlign: 'left',
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
    textAlign: 'center',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 12,
    color: '#3498db',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 1.4,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { personalInfo, score, answers, language } = req.body as RequestBody;

    // Validate required fields
    if (!personalInfo || !personalInfo.name || !personalInfo.email || !personalInfo.company) {
      return res.status(400).json({ message: 'Missing required personal information' });
    }

    if (score === undefined || score === null) {
      return res.status(400).json({ message: 'Score is required' });
    }

    if (!answers || Object.keys(answers).length === 0) {
      return res.status(400).json({ message: 'Answers are required' });
    }

    // Use the language parameter to get the correct translations
    const t = translations[language] || translations.en;
    const styles = createStyles();
    const currentQuestions = questionsData.en;

    // Create the PDF document using React.createElement
    const createDocument = () => {
      const questionRows = Object.entries(answers).map(([questionId, answerValue]) => {
        const question = currentQuestions.find((q: Question) => q.id === questionId);
        const answer = question?.options.find((opt: { value: string; label: string }) => opt.value === answerValue);
        return React.createElement(View, { key: questionId, style: styles.tableRow },
          React.createElement(View, { style: styles.tableCol },
            React.createElement(Text, { style: styles.tableCell }, question?.text || 'Unknown question')
          ),
          React.createElement(View, { style: styles.tableCol },
            React.createElement(Text, { style: styles.tableCell }, answer?.label || 'Unknown answer')
          )
        );
      });

      return React.createElement(Document, {},
        React.createElement(Page, { size: "A4", style: styles.page },
          // Header with Logo
          React.createElement(View, { style: styles.header },
            React.createElement(Image, {
              style: styles.logo,
              src: "https://cdn-nexlink.s3.us-east-2.amazonaws.com/rsm-international-vector-logo_2-removebg-preview_5f53785d-2f5c-421e-a976-6388f78a00f2.png"
            }),
            React.createElement(Text, { style: styles.title }, t.pdfLabels.assessmentResults)
          ),

          // Personal Information Section
          React.createElement(View, { style: styles.section },
            React.createElement(View, { style: styles.tableRow },
              React.createElement(View, { style: [styles.tableColHeader, { width: '100%' }] },
                React.createElement(Text, { style: styles.tableCellHeader }, t.pdfLabels.personalInfo)
              )
            ),
            React.createElement(View, { style: styles.tableRow },
              React.createElement(View, { style: styles.tableColHeader },
                React.createElement(Text, { style: styles.tableCellHeader }, `${t.pdfLabels.name}:`)
              ),
              React.createElement(View, { style: styles.tableCol },
                React.createElement(Text, { style: styles.tableCell }, personalInfo.name)
              )
            ),
            React.createElement(View, { style: styles.tableRow },
              React.createElement(View, { style: styles.tableColHeader },
                React.createElement(Text, { style: styles.tableCellHeader }, `${t.pdfLabels.email}:`)
              ),
              React.createElement(View, { style: styles.tableCol },
                React.createElement(Text, { style: styles.tableCell }, personalInfo.email)
              )
            ),
            React.createElement(View, { style: styles.tableRow },
              React.createElement(View, { style: styles.tableColHeader },
                React.createElement(Text, { style: styles.tableCellHeader }, `${t.pdfLabels.company}:`)
              ),
              React.createElement(View, { style: styles.tableCol },
                React.createElement(Text, { style: styles.tableCell }, personalInfo.company)
              )
            ),
            React.createElement(View, { style: styles.tableRow },
              React.createElement(View, { style: styles.tableColHeader },
                React.createElement(Text, { style: styles.tableCellHeader }, `${t.pdfLabels.position}:`)
              ),
              React.createElement(View, { style: styles.tableCol },
                React.createElement(Text, { style: styles.tableCell }, personalInfo.position)
              )
            )
          ),

          // Score Section
          React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.score }, `${t.pdfLabels.score}: ${score}`),
            React.createElement(Text, { style: styles.resultText }, getResultText(score, language))
          ),

          // Questions and Answers Section
          React.createElement(View, { style: styles.section },
            React.createElement(View, { style: styles.tableRow },
              React.createElement(View, { style: styles.tableColHeader },
                React.createElement(Text, { style: styles.tableCellHeader }, t.pdfLabels.question)
              ),
              React.createElement(View, { style: styles.tableColHeader },
                React.createElement(Text, { style: styles.tableCellHeader }, t.pdfLabels.answer)
              )
            ),
            ...questionRows
          )
        )
      );
    };

    // Generate PDF buffer
    const pdfBuffer = await pdf(createDocument()).toBuffer();

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=assessment_report.pdf');

    // Send the PDF
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    
    // Provide more detailed error information
    if (error instanceof Error) {
      res.status(500).json({ 
        message: 'Error generating PDF', 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    } else {
      res.status(500).json({ message: 'Unknown error generating PDF' });
    }
  }
}
