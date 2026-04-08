const { Router } = require("express");
const { create, filterByCuisine, getAll, search } = require("../controllers/restaurantController");

const router = Router();

// Points d'entrée de l'API restaurants
router.get("/", getAll);
router.get("/search", search);
router.get("/filter", filterByCuisine);
router.post("/", create);

module.exports = router;
