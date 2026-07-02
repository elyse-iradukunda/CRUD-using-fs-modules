import { Request, Response } from "express";
import { readData, writeData } from "../utils/file.ts";

import { Item } from "../types/items.ts";

export const getItems = (req: Request, res: Response): void => {
  res.json(readData());
};

export const createItem = (req: Request, res: Response): void => {
  const items: Item[] = readData();

  const newItem: Item = {
    id: Date.now(),
    ...req.body
  };

  items.push(newItem);

  writeData(items);

  res.status(201).json(newItem);
};

export const updateItem = (req: Request, res: Response): void => {
  const items: Item[] = readData();
  const id: number = Number(req.params.id);

  const index = items.findIndex((item: Item) => item.id === id);

  if (index === -1) {
    res.status(404).json({
      message: "Item not found"
    });
    return;
  }

  items[index] = {
    ...items[index],
    ...req.body
  };

  writeData(items);

  res.json(items[index]);
};

export const deleteItem = (req: Request, res: Response): void => {
  const items: Item[] = readData();
  const id: number = Number(req.params.id);

  const filtered = items.filter((item: Item) => item.id !== id);

  if (filtered.length === items.length) {
    res.status(404).json({
      message: "Item not found"
    });
    return;
  }

  writeData(filtered);

  res.json({
    message: "Item deleted"
  });
};