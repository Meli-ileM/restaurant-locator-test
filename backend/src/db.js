const { Pool } = require("pg");

// Le pool limite les coûts de connexion et stabilise l'API quand plusieurs requêtes arrivent en parallèle.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Supabase impose TLS ; on garde ce réglage explicite pour éviter les surprises d'environnement.
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;
