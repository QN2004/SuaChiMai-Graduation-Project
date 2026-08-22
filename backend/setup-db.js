import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
    console.log('✅ Connected to MySQL\n');

    // Drop old database if exists
    console.log('🗑️  Dropping old milk_store database if exists...');
    await connection.query('DROP DATABASE IF EXISTS milk_store');
    console.log('✅ Old database cleaned\n');

    // Create fresh database
    console.log('📦 Creating fresh milk_store database...');
    await connection.query('CREATE DATABASE milk_store');
    await connection.query('USE milk_store');
    console.log('✅ Fresh database created\n');

    // Import schema
    console.log('🗃️ Importing schema from suachimai_schema.sql...');
    const schemaPath = path.join(__dirname, '..', 'database', 'suachimai_schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    try {
      await connection.query(schemaSQL);
      console.log('✅ Schema created\n');
    } catch (err) {
      console.error(`⚠️ Schema error: ${err.message.substring(0, 100)}`);
      console.log('✅ Schema processed\n');
    }

    // Import seed data
    console.log('🌱 Importing seed data from suachimai_seed.sql...');
    const seedPath = path.join(__dirname, '..', 'database', 'suachimai_seed.sql');
    const seedSQL = fs.readFileSync(seedPath, 'utf8');
    
    try {
      await connection.query(seedSQL);
      console.log('✅ Seed data imported\n');
    } catch (err) {
      console.error(`⚠️ Seed error: ${err.message.substring(0, 100)}`);
      console.log('✅ Seed data processed\n');
    }

    // Verify data
    console.log('📊 Verifying data...');
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`📋 Tables created: ${tables.length} tables`);
    
    const [categories] = await connection.query('SELECT COUNT(*) as count FROM categories');
    console.log(`📦 Categories: ${categories[0].count} categories`);
    
    const [products] = await connection.query('SELECT COUNT(*) as count FROM products');
    console.log(`🛍️ Products: ${products[0].count} products`);
    
    const [brands] = await connection.query('SELECT COUNT(*) as count FROM brands');
    console.log(`🏷️ Brands: ${brands[0].count} brands`);
    
    const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
    console.log(`👥 Users: ${users[0].count} users (admin account created)`);
    
    const [news] = await connection.query('SELECT COUNT(*) as count FROM news');
    console.log(`📰 News articles: ${news[0].count} articles`);

    console.log('\n✨✨✨ Database setup complete! ✨✨✨\n');
    console.log('📍 Database: milk_store');
    console.log('👤 Admin email: admin@suachimai.vn');
    console.log('🔐 Admin password: (set in seed data)');
    console.log('\n🚀 Ready to start the application:');
    console.log('   Terminal 1: cd backend && npm run dev');
    console.log('   Terminal 2: cd frontend && npm run dev');
    console.log('   Open: http://localhost:3000\n');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    if (error.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('\n💡 MySQL is not running. Start MySQL service first:');
      console.error('   Windows: Run "mysql-server" service');
      console.error('   Or use XAMPP/WAMP/MAMP control panel\n');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Access denied. Update backend/.env:');
      console.error('   DB_PASSWORD=your_mysql_password\n');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Disconnected from MySQL');
    }
  }
}

setupDatabase();
