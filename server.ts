import express from "express";
import itemRoutes from "./routes/items.js";

const app = express();
const PORT: number = 3000;

app.use(express.json());

app.use("/items", itemRoutes);

app.listen(PORT, (): void => {
  console.log(`Server running on port ${PORT}`);
});