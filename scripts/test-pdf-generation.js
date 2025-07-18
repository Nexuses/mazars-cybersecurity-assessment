const fetch = require('node-fetch');

async function testPdfGeneration() {
  const testData = {
  personalInfo: {
    name: "Test User",
    email: "test@example.com",
    environmentUniqueName: "Test Environment",
    company: "Test Company",
    position: "Test Position"
  },
  score: 85,
  answers: {
    "q1": "1",
    "q2": "2", 
    "q3": "3",
    "q4": "4",
    "q5": "5"
  },
  questions: [
    {
      id: "q1",
      text: "Test Question 1",
      category: "Security Governance",
      area: "Governance",
      options: [
        { value: "1", label: "In no case" },
        { value: "2", label: "In a few cases" },
        { value: "3", label: "About half cases" },
        { value: "4", label: "In most cases" },
        { value: "5", label: "In all cases" }
      ]
    },
    {
      id: "q2", 
      text: "Test Question 2",
      category: "Information Risk Assessment",
      area: "Risk Assessment",
      options: [
        { value: "1", label: "In no case" },
        { value: "2", label: "In a few cases" },
        { value: "3", label: "About half cases" },
        { value: "4", label: "In most cases" },
        { value: "5", label: "In all cases" }
      ]
    },
    {
      id: "q3",
      text: "Test Question 3", 
      category: "Security Management",
      area: "Management",
      options: [
        { value: "1", label: "In no case" },
        { value: "2", label: "In a few cases" },
        { value: "3", label: "About half cases" },
        { value: "4", label: "In most cases" },
        { value: "5", label: "In all cases" }
      ]
    },
    {
      id: "q4",
      text: "Test Question 4",
      category: "People Management", 
      area: "People",
      options: [
        { value: "1", label: "In no case" },
        { value: "2", label: "In a few cases" },
        { value: "3", label: "About half cases" },
        { value: "4", label: "In most cases" },
        { value: "5", label: "In all cases" }
      ]
    },
    {
      id: "q5",
      text: "Test Question 5",
      category: "Information Management",
      area: "Information", 
      options: [
        { value: "1", label: "In no case" },
        { value: "2", label: "In a few cases" },
        { value: "3", label: "About half cases" },
        { value: "4", label: "In most cases" },
        { value: "5", label: "In all cases" }
      ]
    }
  ],
  selectedCategories: ["Security Governance", "Information Risk Assessment", "Security Management", "People Management", "Information Management"],
  selectedAreas: ["Governance", "Risk Assessment", "Management", "People", "Information"],
  responseTypeSummary: [
    { label: "In no case", count: 1, percentage: 20.0 },
    { label: "In a few cases", count: 1, percentage: 20.0 },
    { label: "About half cases", count: 1, percentage: 20.0 },
    { label: "In most cases", count: 1, percentage: 20.0 },
    { label: "In all cases", count: 1, percentage: 20.0 }
  ],
  categoryBreakdown: [
    {
      category: "Security Governance",
      categoryCode: "SG",
      breakdown: { "In no case": 1 }
    },
    {
      category: "Information Risk Assessment", 
      categoryCode: "IR",
      breakdown: { "In a few cases": 1 }
    },
    {
      category: "Security Management",
      categoryCode: "SM", 
      breakdown: { "About half cases": 1 }
    },
    {
      category: "People Management",
      categoryCode: "PM",
      breakdown: { "In most cases": 1 }
    },
    {
      category: "Information Management",
      categoryCode: "IM",
      breakdown: { "In all cases": 1 }
    }
  ],
  questionAnswers: [
    {
      id: "q1",
      question: "Test Question 1",
      answer: "In no case",
      category: "Security Governance",
      area: "Governance"
    },
    {
      id: "q2",
      question: "Test Question 2", 
      answer: "In a few cases",
      category: "Information Risk Assessment",
      area: "Risk Assessment"
    },
    {
      id: "q3",
      question: "Test Question 3",
      answer: "About half cases", 
      category: "Security Management",
      area: "Management"
    },
    {
      id: "q4",
      question: "Test Question 4",
      answer: "In most cases",
      category: "People Management", 
      area: "People"
    },
    {
      id: "q5",
      question: "Test Question 5",
      answer: "In all cases",
      category: "Information Management",
      area: "Information"
    }
  ],
  totalAnswered: 5,
  language: "en"
};

  try {
    console.log('Testing PDF generation with new fields...');
    console.log('Test data:', JSON.stringify(testData, null, 2));
    
    const response = await fetch('http://localhost:3000/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    if (response.ok) {
      const buffer = await response.buffer();
      console.log('✅ PDF generation successful!');
      console.log(`📄 PDF size: ${buffer.length} bytes`);
      
      // Save the PDF for inspection
      const fs = require('fs');
      fs.writeFileSync('test-pdf-output.pdf', buffer);
      console.log('💾 PDF saved as test-pdf-output.pdf');
    } else {
      const errorText = await response.text();
      console.error('❌ PDF generation failed:');
      console.error('Status:', response.status);
      console.error('Error:', errorText);
    }
  } catch (error) {
    console.error('❌ Error testing PDF generation:', error.message);
  }
}

// Run the test
testPdfGeneration(); 