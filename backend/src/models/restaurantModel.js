const pool = require("../db");

// On convertit explicitement en nombre pour aligner la couche API avec les contraintes DECIMAL en base.
// DECIMAL(10,8)/(11,8) est pertinent ici pour préserver la précision géographique requise par Geoptis.
const createRestaurant = async ({ name, address, latitude, longitude, cuisine_type, phone_number }) => {
  const result = await pool.query(
    "INSERT INTO restaurants (name, address, latitude, longitude, cuisine_type, phone_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [name, address, parseFloat(latitude), parseFloat(longitude), cuisine_type, phone_number]
  );
  return result.rows[0];
};

// Ce contrôle anti-doublon évite de polluer la base avec la même fiche métier saisie plusieurs fois.
const findRestaurantByNameAndAddress = async ({ name, address }) => {
  const result = await pool.query(
    `SELECT *
     FROM restaurants
     WHERE LOWER(name) = LOWER($1)
       AND LOWER(address) = LOWER($2)
     LIMIT 1`,
    [name, address]
  );

  return result.rows[0] || null;
};

// Tri stable par id pour garder un ordre prévisible entre deux rafraîchissements.
const getAllRestaurants = async () => {
  const result = await pool.query("SELECT * FROM restaurants ORDER BY id ASC");
  return result.rows;
};

// ILIKE rend la recherche tolérante à la casse, ce qui correspond à un usage utilisateur réel.
const searchRestaurants = async (searchTerm) => {
  const result = await pool.query(
    `SELECT *
     FROM restaurants
     WHERE name ILIKE $1 OR address ILIKE $1
     ORDER BY id ASC`,
    [`%${searchTerm}%`]
  );

  return result.rows;
};

// Filtre strict sur la valeur normalisée pour conserver des statistiques de cuisine cohérentes.
const filterRestaurantsByCuisine = async (cuisineType) => {
  const result = await pool.query(
    `SELECT *
     FROM restaurants
     WHERE cuisine_type = $1
     ORDER BY id ASC`,
    [cuisineType]
  );

  return result.rows;
};

module.exports = {
  createRestaurant,
  filterRestaurantsByCuisine,
  findRestaurantByNameAndAddress,
  getAllRestaurants,
  searchRestaurants,
};
