const { Pool } = require("pg");

// Connexion à PostgreSQL via l'URL définie dans .env
// On utilise un Pool pour gérer plusieurs connexions simultanées
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Requis pour Supabase (connexion TLS)
});

module.exports = pool;
