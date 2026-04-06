const { Router } = require("express");
const { create, getAll } = require("../controllers/restaurantController");

const router = Router();

// Points d'entrée de l'API restaurants
router.get("/", getAll);
router.post("/", create);

module.exports = router;
