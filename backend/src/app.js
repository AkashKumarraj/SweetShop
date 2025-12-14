const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const sequelize = require("./config/db");
require("./models/Sweet");

const authRoutes = require("./routes/authRoutes");
const sweetRoutes = require("./routes/sweetRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetRoutes);


sequelize.sync().then(() => {
    console.log("Database connected");
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
