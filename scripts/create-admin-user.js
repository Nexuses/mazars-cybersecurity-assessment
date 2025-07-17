const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://neeraj:forvis2025@cluster0.ggkwnt1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
  
  if (!uri) {
    console.error('MONGODB_URI environment variable is not set');
    process.exit(1);
  }

  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db();
    const adminUsers = db.collection('admin_users');

    // Check if admin user already exists
    const existingAdmin = await adminUsers.findOne({ email: 'admin@forvismazars.com' });
    
    if (existingAdmin) {
      console.log('ℹ️ Admin user already exists');
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Name: ${existingAdmin.name}`);
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = {
      email: 'admin@forvismazars.com',
      password: hashedPassword,
      name: 'Admin',
      createdAt: new Date()
    };

    const result = await adminUsers.insertOne(adminUser);
    console.log('✅ Admin user created successfully');
    console.log(`ID: ${result.insertedId}`);
    console.log(`Email: ${adminUser.email}`);
    console.log(`Password: admin123`);
    console.log('\n📝 You can now login to the admin dashboard with:');
    console.log('Email: admin@forvismazars.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('✅ Disconnected from MongoDB');
  }
}

createAdminUser().catch(console.error); 