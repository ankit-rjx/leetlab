import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problms.routes.js "

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser()); 

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/problems",problemRoutes);

app.get("/",(req,res)=>{
  res.send(" Hello Guys Welcome to leetlab 🔥 ")
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
