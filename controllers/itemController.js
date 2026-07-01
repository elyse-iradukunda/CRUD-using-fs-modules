import { readData, writeData } from "../utils/file.js";

export const getItems = (req, res) => {
  res.json(readData());
};

export const createItem = (req, res) => {
  const items = readData();

  const newItem = {
    id: Date.now(),
    ...req.body
  };

  items.push(newItem);

  writeData(items);

  res.status(201).json(newItem);
};

export const updateItem = (req, res) => {
  const items = readData();
  const id = Number(req.params.id);

  const index = items.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Item not found"
    });
  }

  items[index] = {
    ...items[index],
    ...req.body
  };

  writeData(items);

  res.json(items[index]);
};

export const deleteItem = (req, res) => {
  const items = readData();
  const id = Number(req.params.id);

  const filtered = items.filter(item => item.id !== id);

  if (filtered.length === items.length) {
    return res.status(404).json({
      message: "Item not found"
    });
  }

  writeData(filtered);

  res.json({
    message: "Item deleted"
  });
};