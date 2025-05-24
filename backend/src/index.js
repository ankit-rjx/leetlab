import express from "express";
import dotenv from "dotenv";
const app = express();

dotenv.config();

const port = 3000;

app.listen(process.env.PORT, () => {
  console.log(`Express app listening on port ${port}`);
});
