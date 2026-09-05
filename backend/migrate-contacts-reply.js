import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'milk_store',
  port: Number(process.env.DB_PORT || 3306)
});

try {
  const [columns] = await connection.query('DESCRIBE contacts');
  const names = columns.map((column) => column.Field);

  if (!names.includes('full_name') && names.includes('name')) {
    await connection.query('ALTER TABLE contacts CHANGE COLUMN name full_name VARCHAR(100) NULL');
    console.log('Renamed contacts.name to contacts.full_name');
  }

  if (!names.includes('status')) {
    await connection.query("ALTER TABLE contacts ADD COLUMN status ENUM('new','read','replied') DEFAULT 'new' AFTER message");
    console.log('Added contacts.status');
  }

  if (!names.includes('reply_message')) {
    await connection.query('ALTER TABLE contacts ADD COLUMN reply_message TEXT NULL AFTER status');
    console.log('Added contacts.reply_message');
  }

  if (!names.includes('replied_at')) {
    await connection.query('ALTER TABLE contacts ADD COLUMN replied_at TIMESTAMP NULL AFTER reply_message');
    console.log('Added contacts.replied_at');
  }

  console.log('Contacts reply migration completed');
} finally {
  await connection.end();
}
