/* Project: TOPOS - Gestion d'emplacements géospatiaux | Author: Melissa */

const express = require("express");
const cors = require("cors");
const restaurantRoutes = require("./routes/restaurantRoutes");

const app = express();

// On centralise ici les middlewares transverses pour garder des routes métier lisibles.
app.use(cors());
app.use(express.json());

// Point d'entrée unique pour la ressource restaurants afin de simplifier l'API publique.
app.use("/api/restaurants", restaurantRoutes);

module.exports = app;
