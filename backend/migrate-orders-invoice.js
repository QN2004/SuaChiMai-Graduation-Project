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
  const [columns] = await connection.query('DESCRIBE orders');
  const names = columns.map((column) => column.Field);

  if (!names.includes('order_number')) {
    await connection.query('ALTER TABLE orders ADD COLUMN order_number VARCHAR(50) NULL AFTER id');
    console.log('Added orders.order_number');
  }

  await connection.query("UPDATE orders SET order_number=CONCAT('CM', DATE_FORMAT(created_at, '%y%m%d'), LPAD(id, 4, '0')) WHERE order_number IS NULL OR order_number=''");
  console.log('Backfilled missing order numbers');

  const [indexes] = await connection.query("SHOW INDEX FROM orders WHERE Key_name='idx_order_number'");
  if (!indexes.length) {
    await connection.query('CREATE INDEX idx_order_number ON orders(order_number)');
    console.log('Added idx_order_number');
  }

  console.log('Orders invoice migration completed');
} finally {
  await connection.end();
}
