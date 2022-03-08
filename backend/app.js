const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

require("dotenv").config();

const app = express();

const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

// Sécurité, limitation du nombre de requête répétitive.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Connection BDD
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  
  next();
});

app.use(express.json());

//Sécurité
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(limiter);

app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app; 
