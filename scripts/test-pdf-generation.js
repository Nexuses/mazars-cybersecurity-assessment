const fetch = require('node-fetch');

async function testPdfGeneration() {
  const testData = {
    personalInfo: {
      name: "Test User",
      email: "test@example.com",
      environmentUniqueName: "Test Environment",
      company: "Test Company", // This should be ignored in the new PDF
      position: "Test Position" // This should be ignored in the new PDF
    },
    score: 85,
    answers: {
      "q1": "yes",
      "q2": "no",
      "q3": "sometimes"
    },
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