import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
const app = express();

dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello Guys Welcome to leetlab 🔥");
});

app.use("/api/v1/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Express app listening on port ${process.env.PORT}`);
});
