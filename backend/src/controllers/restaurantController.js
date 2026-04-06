const { createRestaurant, getAllRestaurants } = require("../models/restaurantModel");

/**
 * Valide les coordonnées géographiques.
 * Latitude : [-90, 90] (axe Nord/Sud)
 * Longitude : [-180, 180] (axe Est/Ouest)
 * Retourne un message d'erreur explicite, ou null si valide.
 */
const validateCoordinates = (latitude, longitude) => {
  if (latitude === undefined || longitude === undefined) {
    return "Les champs latitude et longitude sont requis.";
  }
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  if (isNaN(lat) || isNaN(lng)) {
    return "La latitude et la longitude doivent être des nombres.";
  }
  if (lat < -90 || lat > 90) {
    return "La latitude doit être comprise entre -90 et 90.";
  }
  if (lng < -180 || lng > 180) {
    return "La longitude doit être comprise entre -180 et 180.";
  }
  return null;
};

// Crée un restaurant après validation des champs et des coordonnées géographiques
const create = async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || name.trim().length < 3) {
    return res.status(400).json({ error: "Le nom doit contenir au moins 3 caractères." });
  }
  if (!address || address.trim().length < 10) {
    return res.status(400).json({ error: "L'adresse doit contenir au moins 10 caractères." });
  }

  const coordError = validateCoordinates(latitude, longitude);
  if (coordError) {
    return res.status(400).json({ error: coordError });
  }

  try {
    const restaurant = await createRestaurant({
      name: name.trim(),
      address: address.trim(),
      latitude,
      longitude,
    });
    res.status(201).json(restaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur lors de la création du restaurant." });
  }
};

// Retourne la liste complète des restaurants
const getAll = async (req, res) => {
  try {
    const restaurants = await getAllRestaurants();
    res.json(restaurants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des restaurants." });
  }
};

module.exports = { create, getAll };
