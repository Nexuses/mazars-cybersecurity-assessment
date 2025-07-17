const fetch = require('node-fetch');

async function testGetAssessments() {
  try {
    console.log('🔍 Testing /api/get-assessments endpoint...');
    
    const response = await fetch('http://localhost:3000/api/get-assessments?limit=10&skip=0');
    
    if (!response.ok) {
      console.error(`❌ HTTP error! status: ${response.status}`);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('✅ API Response:');
    console.log(JSON.stringify(data, null, 2));
    
    console.log(`\n📊 Summary:`);
    console.log(`- Total assessments: ${data.assessments?.length || 0}`);
    console.log(`- Pagination total: ${data.pagination?.total || 0}`);
    console.log(`- Statistics:`, data.statistics);
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

testGetAssessments().catch(console.error); 