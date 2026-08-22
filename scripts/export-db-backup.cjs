const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const rootDir = path.resolve(__dirname, '..');
const envPath = path.join(rootDir, 'backend', '.env');

function readEnv(filePath) {
  const env = {};
  if (!fs.existsSync(filePath)) return env;
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const index = trimmed.indexOf('=');
    if (index === -1) continue;
    env[trimmed.slice(0, index)] = trimmed.slice(index + 1);
  }
  return env;
}

function quoteId(value) {
  return `\`${String(value).replace(/`/g, '``')}\``;
}

function sqlValue(value) {
  if (value === null || value === undefined) return 'NULL';
  if (Buffer.isBuffer(value)) return `X'${value.toString('hex')}'`;
  if (value instanceof Date) {
    const pad = (part) => String(part).padStart(2, '0');
    return `'${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())} ${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}'`;
  }
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : 'NULL';
  if (typeof value === 'boolean') return value ? '1' : '0';
  return `'${String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\0/g, '\\0')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\x1a/g, '\\Z')
    .replace(/'/g, "\\'")}'`;
}

function timestamp() {
  const date = new Date();
  const pad = (part) => String(part).padStart(2, '0');
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}_${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

async function main() {
  const env = readEnv(envPath);
  const database = env.DB_NAME || 'milk_store';
  const outputDir = path.join(rootDir, 'database', 'backups');
  fs.mkdirSync(outputDir, { recursive: true });

  const connection = await mysql.createConnection({
    host: env.DB_HOST || 'localhost',
    user: env.DB_USER || 'root',
    password: env.DB_PASSWORD || '',
    port: Number(env.DB_PORT || 3306),
    database,
    multipleStatements: true
  });

  const lines = [
    `-- Database backup for ${database}`,
    `-- Generated at ${new Date().toISOString()}`,
    'SET NAMES utf8mb4;',
    'SET FOREIGN_KEY_CHECKS=0;',
    `CREATE DATABASE IF NOT EXISTS ${quoteId(database)} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
    `USE ${quoteId(database)};`,
    ''
  ];

  const [tableRows] = await connection.query('SHOW FULL TABLES');
  const tableNameKey = `Tables_in_${database}`;
  const baseTables = tableRows.filter((row) => row.Table_type === 'BASE TABLE').map((row) => row[tableNameKey]);
  const views = tableRows.filter((row) => row.Table_type === 'VIEW').map((row) => row[tableNameKey]);

  for (const table of baseTables) {
    const [createRows] = await connection.query(`SHOW CREATE TABLE ${quoteId(table)}`);
    lines.push(`DROP TABLE IF EXISTS ${quoteId(table)};`);
    lines.push(`${createRows[0]['Create Table']};`);
    lines.push('');

    const [rows, fields] = await connection.query(`SELECT * FROM ${quoteId(table)}`);
    if (!rows.length) continue;

    const columns = fields.map((field) => quoteId(field.name)).join(', ');
    for (const row of rows) {
      const values = fields.map((field) => sqlValue(row[field.name])).join(', ');
      lines.push(`INSERT INTO ${quoteId(table)} (${columns}) VALUES (${values});`);
    }
    lines.push('');
  }

  for (const view of views) {
    const [createRows] = await connection.query(`SHOW CREATE VIEW ${quoteId(view)}`);
    lines.push(`DROP VIEW IF EXISTS ${quoteId(view)};`);
    lines.push(`${createRows[0]['Create View']};`);
    lines.push('');
  }

  const [triggers] = await connection.query('SHOW TRIGGERS');
  for (const trigger of triggers) {
    const [createRows] = await connection.query(`SHOW CREATE TRIGGER ${quoteId(trigger.Trigger)}`);
    lines.push(`DROP TRIGGER IF EXISTS ${quoteId(trigger.Trigger)};`);
    lines.push('DELIMITER ;;');
    lines.push(`${createRows[0]['SQL Original Statement']};;`);
    lines.push('DELIMITER ;');
    lines.push('');
  }

  lines.push('SET FOREIGN_KEY_CHECKS=1;');
  lines.push('');

  const fileName = `${database}_${timestamp()}.sql`;
  const outputPath = path.join(outputDir, fileName);
  const latestPath = path.join(outputDir, `${database}_latest.sql`);
  fs.writeFileSync(outputPath, lines.join('\n'), 'utf8');
  fs.copyFileSync(outputPath, latestPath);

  await connection.end();
  console.log(outputPath);
  console.log(latestPath);
  console.log(`Exported ${baseTables.length} tables, ${views.length} views, ${triggers.length} triggers.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
