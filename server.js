import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "data.json");

if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, "[]");
}

const readData = () => {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const writeData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

app.get("/items", (req, res) => {
  res.json(readData());
});

app.post("/items", (req, res) => {
  const items = readData();

  const newItem = {
    id: Date.now(),
    ...req.body
  };

  items.push(newItem);
  writeData(items);

  res.status(201).json(newItem);
});

app.put("/items/:id", (req, res) => {
  const items = readData();
  const id = Number(req.params.id);

  const index = items.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Item not found" });
  }

  items[index] = {
    ...items[index],
    ...req.body
  };

  writeData(items);

  res.json(items[index]);
});

app.delete("/items/:id", (req, res) => {
  const items = readData();
  const id = Number(req.params.id);

  const filtered = items.filter(item => item.id !== id);

  if (filtered.length === items.length) {
    return res.status(404).json({ message: "Item not found" });
  }

  writeData(filtered);

  res.json({ message: "Item deleted" });
});

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});