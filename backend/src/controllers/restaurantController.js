const {
  createRestaurant,
  filterRestaurantsByCuisine,
  findRestaurantByNameAndAddress,
  getAllRestaurants,
  searchRestaurants,
} = require("../models/restaurantModel");

const ALLOWED_CUISINES = [
  "Française",
  "Italienne",
  "Asiatique",
  "Américaine",
  "Méditerranéenne",
  "Autre",
];

const CUISINE_ALIASES = {
  francaise: "Française",
  française: "Française",
  italienne: "Italienne",
  asiatique: "Asiatique",
  americaine: "Américaine",
  américaine: "Américaine",
  mediterraneenne: "Méditerranéenne",
  méditerranéenne: "Méditerranéenne",
  autre: "Autre",
};

// On force une représentation canonique des cuisines pour éviter les doublons sémantiques dans les filtres.
const normalizeCuisineType = (value) => {
  if (!value || typeof value !== "string") {
    return null;
  }

  return CUISINE_ALIASES[value.trim().toLowerCase()] || null;
};

// On garde un format souple pour couvrir plusieurs pays tout en bloquant les saisies manifestement invalides.
const validatePhoneNumber = (phoneNumber) => {
  if (phoneNumber === undefined || phoneNumber === null || phoneNumber === "") {
    return null;
  }

  const sanitizedPhone = phoneNumber.trim();
  const phoneRegex = /^\+?[0-9().\-\s]{6,20}$/;

  if (!phoneRegex.test(sanitizedPhone)) {
    return "Le numéro de téléphone doit avoir un format valide, par exemple +33 1 42 21 20 00.";
  }

  return null;
};

// On sécurise ici la validité géographique pour éviter des points incohérents sur la carte.
const validateCoordinates = (latitude, longitude) => {
  if (latitude === undefined || latitude === null || latitude === "") {
    return "La latitude est requise et doit représenter une position Nord/Sud valide.";
  }

  if (longitude === undefined || longitude === null || longitude === "") {
    return "La longitude est requise et doit représenter une position Est/Ouest valide.";
  }

  const lat = Number(latitude);
  const lng = Number(longitude);

  if (Number.isNaN(lat)) {
    return "La latitude doit être un nombre décimal valide compris entre -90 et 90.";
  }

  if (Number.isNaN(lng)) {
    return "La longitude doit être un nombre décimal valide compris entre -180 et 180.";
  }

  if (lat < -90 || lat > 90) {
    return "La latitude est hors plage : elle doit être comprise entre -90 et 90 degrés.";
  }

  if (lng < -180 || lng > 180) {
    return "La longitude est hors plage : elle doit être comprise entre -180 et 180 degrés.";
  }

  return null;
};

// Regrouper les règles métier dans un seul point réduit les divergences entre endpoints.
const validateRestaurantPayload = ({ name, address, latitude, longitude, cuisine_type, phone_number }) => {
  if (!name || name.trim().length < 3) {
    return "Le nom du restaurant est requis et doit contenir au moins 3 caractères.";
  }

  if (!address || address.trim().length < 10) {
    return "L'adresse est requise et doit contenir au moins 10 caractères.";
  }

  const normalizedCuisine = normalizeCuisineType(cuisine_type);
  if (!normalizedCuisine) {
    return `Le type de cuisine est requis et doit être l'une des valeurs suivantes : ${ALLOWED_CUISINES.join(", ")}.`;
  }

  const phoneError = validatePhoneNumber(phone_number);
  if (phoneError) {
    return phoneError;
  }

  return validateCoordinates(latitude, longitude);
};

// La création passe d'abord par les garde-fous métier pour éviter les retours SQL peu lisibles côté client.
const create = async (req, res) => {
  const { name, address, latitude, longitude, cuisine_type, phone_number } = req.body;

  const validationError = validateRestaurantPayload({
    name,
    address,
    latitude,
    longitude,
    cuisine_type,
    phone_number,
  });
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const existingRestaurant = await findRestaurantByNameAndAddress({
      name: name.trim(),
      address: address.trim(),
    });

    if (existingRestaurant) {
      return res.status(409).json({
        error: `Un restaurant nommé \"${name.trim()}\" existe déjà à l'adresse \"${address.trim()}\".`,
      });
    }

    const restaurant = await createRestaurant({
      name: name.trim(),
      address: address.trim(),
      latitude,
      longitude,
      cuisine_type: normalizeCuisineType(cuisine_type),
      phone_number: phone_number?.trim() || null,
    });
    res.status(201).json(restaurant);
  } catch {
    res.status(500).json({ error: "Erreur serveur lors de la création du restaurant." });
  }
};

// Endpoint de base pour initialiser le dashboard sans filtre.
const getAll = async (req, res) => {
  try {
    const restaurants = await getAllRestaurants();
    res.json(restaurants);
  } catch {
    res.status(500).json({ error: "Erreur serveur lors de la récupération des restaurants." });
  }
};

// Recherche métier principale: l'utilisateur pense en nom ou en adresse, pas en identifiant technique.
const search = async (req, res) => {
  const searchTerm = req.query.q?.trim();

  if (!searchTerm) {
    return res.status(400).json({ error: "Le paramètre q est requis pour rechercher un restaurant par nom ou par adresse." });
  }

  try {
    const restaurants = await searchRestaurants(searchTerm);
    res.json(restaurants);
  } catch {
    res.status(500).json({ error: "Erreur serveur lors de la recherche des restaurants." });
  }
};

// Le filtre cuisine reste strict pour garder des regroupements statistiques fiables.
const filterByCuisine = async (req, res) => {
  const requestedCuisine = req.query.cuisine?.trim();
  const normalizedCuisine = normalizeCuisineType(requestedCuisine);

  if (!requestedCuisine) {
    return res.status(400).json({ error: "Le paramètre cuisine est requis pour filtrer les restaurants par type." });
  }

  if (!normalizedCuisine) {
    return res.status(400).json({ error: `Le type de cuisine demandé est invalide. Valeurs acceptées : ${ALLOWED_CUISINES.join(", ")}.` });
  }

  try {
    const restaurants = await filterRestaurantsByCuisine(normalizedCuisine);
    res.json(restaurants);
  } catch {
    res.status(500).json({ error: "Erreur serveur lors du filtrage des restaurants." });
  }
};

module.exports = { create, filterByCuisine, getAll, search };
