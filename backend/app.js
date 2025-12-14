const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const sequelize = require("./src/config/db");
require("./src/models/Sweet");
require("./src/models/User");

const authRoutes = require("./src/routes/authRoutes");
const sweetRoutes = require("./src/routes/sweetRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetRoutes);


sequelize.authenticate()
    .then(() => {
        console.log("Database connection established");
        return sequelize.sync({ alter: true });
    })
    .then(() => {
        console.log("Database synced successfully");
    })
    .catch((err) => {
        console.error("Unable to connect to the database:", err);
        console.error("Error details:", err.message);
    });

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
