import express from "express";
import dotenv from "dotenv";
import createConnectionToDB from "./database/connection.js";
import authRoutes from "./routes/auth.route.js";
import morgan from "morgan";

dotenv.config();

const app = express();
// MIDDLEWEAR / PARSER
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// loggers
app.use(morgan("dev"))

const port = process.env.PORT || 3000;

// Homepage
app.get("/home", (req, res) => {
  res.status(200).json({
    message: "Welcome to SQL Database",
  });
});

createConnectionToDB();

app.use("/api/v1", authRoutes);

app.listen(port, (req, res) => {
  console.log(`Server is running on localhost: ${port}`);
});
