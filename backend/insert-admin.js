import mysql from 'mysql2/promise';

async function insertData() {
  const c = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'milk_store'
  });

  console.log('📝 Inserting additional data...');

  try {
    // Insert admin user
    await c.query(
      "INSERT INTO users (email, password, full_name, phone, role) VALUES (?, ?, ?, ?, ?)",
      ['admin@suachimai.vn', '$2a$10$YJJdXzTvXmJ8zzjxN8Qc6eHkPGqzQj8k9Uq2Qj8k9Uq2Qj8k9Uq2', 'Admin Chi Mai', '1900 6363', 'admin']
    );
    console.log('✅ Admin user added');
  } catch (e) {
    console.log('⚠️  Admin user already exists');
  }

  try {
    // Insert news
    await c.query(
      "INSERT INTO news (title, slug, content, image) VALUES (?, ?, ?, ?)",
      ['Cách chọn sữa cho bé', 'cach-chon-sua', 'Hướng dẫn lựa chọn sữa phù hợp', '/uploads/news1.jpg']
    );
    console.log('✅ News added');
  } catch (e) {
    console.log('⚠️  News already exists');
  }

  try {
    // Insert contact
    await c.query(
      "INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)",
      ['Nguyễn Văn A', 'nguyenvana@gmail.com', '0901234567', 'Xin hỏi về chất lượng sữa Chi Mai']
    );
    console.log('✅ Contact added');
  } catch (e) {
    console.log('⚠️  Contact already exists');
  }

  // Verify
  const [users] = await c.query('SELECT COUNT(*) as c FROM users');
  const [news] = await c.query('SELECT COUNT(*) as c FROM news');
  const [contacts] = await c.query('SELECT COUNT(*) as c FROM contacts');
  const [products] = await c.query('SELECT COUNT(*) as c FROM products');

  console.log('\n📊 Final count:');
  console.log(`   👥 Users: ${users[0].c}`);
  console.log(`   📰 News: ${news[0].c}`);
  console.log(`   📧 Contacts: ${contacts[0].c}`);
  console.log(`   🛍️  Products: ${products[0].c}`);

  await c.end();
}

insertData();
