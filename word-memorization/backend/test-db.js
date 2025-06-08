const db = require('./config/db.config');

async function testConnection() {
  try {
    const result = await db.query('SELECT NOW()');
    console.log('Database connection successful!');
    console.log('Current timestamp:', result.rows[0].now);
  } catch (error) {
    console.error('Database connection error:', error);
  }
}

testConnection(); 