import express from "express";
import dotenv from "dotenv";
import createConnectionToDB from "../backend/database/connection.js";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import morgan from "morgan";

dotenv.config();

const app = express();
// MIDDLEWEAR / PARSER
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// loggers
app.use(morgan("dev"));
app.use(cors());

const port = process.env.PORT || 3000;

// Homepage
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to SQL Database",
  });
});

createConnectionToDB();

app.use("/api/v1", authRouter);

app.listen(port, (req, res) => {
  console.log(`Server is running on localhost: ${port}`);
});
