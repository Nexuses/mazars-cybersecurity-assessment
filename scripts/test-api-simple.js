const http = require('http');

function testAPIEndpoint() {
  console.log('🔍 Testing API endpoint...');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/get-assessments',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const req = http.request(options, (res) => {
    console.log('📡 Response status:', res.statusCode);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        try {
          const responseData = JSON.parse(data);
          console.log('✅ API Response successful');
          console.log('📊 Number of assessments:', responseData.assessments?.length || 0);
          console.log('📈 Statistics:', responseData.statistics);
          
          if (responseData.assessments && responseData.assessments.length > 0) {
            console.log('\n📋 First assessment:');
            const firstAssessment = responseData.assessments[0];
            console.log(`  - Name: ${firstAssessment.personalInfo?.name}`);
            console.log(`  - Email: ${firstAssessment.personalInfo?.email}`);
            console.log(`  - Environment: ${firstAssessment.personalInfo?.environmentUniqueName}`);
            console.log(`  - Score: ${firstAssessment.score}`);
            console.log(`  - Created: ${firstAssessment.createdAt}`);
          }
        } catch (error) {
          console.log('❌ Error parsing response:', error.message);
          console.log('Raw response:', data);
        }
      } else {
        console.log('❌ API Response failed');
        console.log('Error details:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error testing API:', error.message);
    console.log('💡 Make sure the development server is running on port 3000');
  });

  req.end();
}

testAPIEndpoint(); 