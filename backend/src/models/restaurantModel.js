const pool = require("../db");

// Insère un nouveau restaurant en base et retourne l'enregistrement créé
const createRestaurant = async ({ name, address, latitude, longitude }) => {
  const result = await pool.query(
    "INSERT INTO restaurants (name, address, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, address, parseFloat(latitude), parseFloat(longitude)]
  );
  return result.rows[0];
};

// Retourne tous les restaurants triés par id croissant
const getAllRestaurants = async () => {
  const result = await pool.query("SELECT * FROM restaurants ORDER BY id ASC");
  return result.rows;
};

module.exports = { createRestaurant, getAllRestaurants };
