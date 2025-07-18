import fetch from 'node-fetch';

async function testAPIEndpoint() {
  try {
    console.log('🔍 Testing API endpoint...');
    
    // Test the get-assessments API
    const response = await fetch('http://localhost:3000/api/get-assessments', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Response successful');
      console.log('📊 Number of assessments:', data.assessments?.length || 0);
      console.log('📈 Statistics:', data.statistics);
      
      if (data.assessments && data.assessments.length > 0) {
        console.log('\n📋 First assessment:');
        const firstAssessment = data.assessments[0];
        console.log(`  - Name: ${firstAssessment.personalInfo?.name}`);
        console.log(`  - Email: ${firstAssessment.personalInfo?.email}`);
        console.log(`  - Environment: ${firstAssessment.personalInfo?.environmentUniqueName}`);
        console.log(`  - Score: ${firstAssessment.score}`);
        console.log(`  - Created: ${firstAssessment.createdAt}`);
      }
    } else {
      console.log('❌ API Response failed');
      const errorText = await response.text();
      console.log('Error details:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
    console.log('💡 Make sure the development server is running on port 3000');
  }
}

testAPIEndpoint(); 