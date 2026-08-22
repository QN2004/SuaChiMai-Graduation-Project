const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  port: 3306,
  multipleStatements: true
};

async function setupDatabase() {
  let connection;
  try {
    console.log('🔌 Connecting to MySQL...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL');

    // Create database
    console.log('\n📦 Creating database milk_store...');
    await connection.query('CREATE DATABASE IF NOT EXISTS milk_store');
    console.log('✅ Database created or already exists');

    // Select database
    await connection.query('USE milk_store');
    console.log('✅ Using milk_store database');

    // Read and execute milk_store.sql
    console.log('\n🗃️ Importing schema from milk_store.sql...');
    const schemaPath = path.join(__dirname, 'database', 'milk_store.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    const schemaBatch = schemaSQL.split(';').filter(s => s.trim());
    
    for (const stmt of schemaBatch) {
      if (stmt.trim()) {
        try {
          await connection.query(stmt);
        } catch (err) {
          // Skip errors if table/index already exists
          if (!err.message.includes('already exists')) {
            console.error(`⚠️ Error: ${err.message}`);
          }
        }
      }
    }
    console.log('✅ Schema imported');

    // Read and execute seed_data.sql
    console.log('\n🌱 Importing seed data from seed_data.sql...');
    const seedPath = path.join(__dirname, 'database', 'seed_data.sql');
    const seedSQL = fs.readFileSync(seedPath, 'utf8');
    const seedBatch = seedSQL.split(';').filter(s => s.trim());
    
    for (const stmt of seedBatch) {
      if (stmt.trim()) {
        try {
          await connection.query(stmt);
        } catch (err) {
          console.error(`⚠️ Seed error: ${err.message}`);
        }
      }
    }
    console.log('✅ Seed data imported');

    // Verify data
    console.log('\n📊 Verifying data...');
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`📋 Tables: ${tables.length} tables found`);
    
    const [products] = await connection.query('SELECT COUNT(*) as count FROM products');
    console.log(`🛍️ Products: ${products[0].count} products`);
    
    const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
    console.log(`👥 Users: ${users[0].count} users`);

    console.log('\n✨ Database setup complete! ✨');
    console.log('You can now refresh: http://localhost:3000/products');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    if (error.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('💡 MySQL is not running. Start MySQL service first.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('💡 Access denied. Check DB_USER and DB_PASSWORD in backend/.env');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Disconnected from MySQL');
    }
  }
}

setupDatabase();
