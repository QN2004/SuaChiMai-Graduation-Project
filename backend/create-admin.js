import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';

const admin = {
  email: 'admin@suachimai.vn',
  password: 'Admin@123',
  fullName: 'Admin Sua Chi Mai',
  phone: '0987654321'
};

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'milk_store',
  port: Number(process.env.DB_PORT || 3306)
});

try {
  const [columns] = await connection.query('DESCRIBE users');
  const columnNames = columns.map((column) => column.Field);

  if (!columnNames.includes('status')) {
    await connection.query('ALTER TABLE users ADD COLUMN status TINYINT DEFAULT 1 AFTER role');
  }

  const passwordHash = await bcrypt.hash(admin.password, 10);

  await connection.query(
    `INSERT INTO users (email, password, full_name, phone, role, status)
     VALUES (?, ?, ?, ?, 'admin', 1)
     ON DUPLICATE KEY UPDATE
       password = VALUES(password),
       full_name = VALUES(full_name),
       phone = VALUES(phone),
       role = 'admin',
       status = 1`,
    [admin.email, passwordHash, admin.fullName, admin.phone]
  );

  const [users] = await connection.query(
    'SELECT id, email, full_name, phone, role, status FROM users WHERE email = ?',
    [admin.email]
  );

  console.log('Admin account ready:');
  console.log(users[0]);
  console.log(`Password: ${admin.password}`);
} finally {
  await connection.end();
}
