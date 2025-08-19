require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('🔌 Testing MongoDB connection...');
    console.log('Connection string:', process.env.MONGODB_URI ? 
      process.env.MONGODB_URI.replace(/:[^:]*@/, ':***@') : 'Not defined');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });
    
    console.log('✅ Successfully connected to MongoDB!');
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    
    // List all collections to verify access
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📂 Collections in database:');
    collections.forEach(col => console.log(`- ${col.name}`));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  }
}

testConnection();
