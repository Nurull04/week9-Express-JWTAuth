const express = require("express");
const app = express();
require("dotenv").config();

const authRoutes = require("./src/routes/authRoutes");
app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
