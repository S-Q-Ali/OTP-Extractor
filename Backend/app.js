// Routes calling go here

const express = require("express");
const app = express();
const corsMiddleware = require("./middlewares/corsMiddleware.js");

// Imported Routes
const healthRoute = require("./routes/healthRoute.js");

// MIDDLEWARES
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use("/", healthRoute);

//LOCAL SERVER
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
