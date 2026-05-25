const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres_secure_pass_123@localhost:5432/cotizador_db?schema=public';
const pool = new Pool({ connectionString });

async function main() {
  const hash = await bcrypt.hash('Password123!', 10);
  console.log('Password hash:', hash);

  // Ensure cp tenant exists
  await pool.query(`INSERT INTO "Tenant" (id, name, created_at, updated_at) VALUES ('cp', 'Casa de Piedra', NOW(), NOW()) ON CONFLICT DO NOTHING;`);
  
  // Upsert user
  await pool.query(`
    INSERT INTO "User" (id, tenant_id, email, password_hash, first_name, last_name, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), 'cp', 'admin_cp@cotizador.com', $1, 'Admin', 'CP', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET password_hash = $1, updated_at = NOW();
  `, [hash]);

  console.log('User admin_cp@cotizador.com updated successfully!');
}
main().then(() => process.exit(0)).catch(console.error);
