import { Request, Response } from "express";
import { readData, writeData } from "../utils/file";
import { validate } from "class-validator";
import { Item } from "../types/items";
import { CreateItemDto } from "../DTO/itemDTO";

export const getItems = (req: Request, res: Response): void => {
  res.json(readData());
};

export const createItem = async (req: Request, res: Response): Promise<void> => {
  const dto = Object.assign(new CreateItemDto(), req.body);

  const errors = await validate(dto);

  if (errors.length > 0) {
    res.status(400).json(errors);
    return;
  }

  const items: Item[] = readData();

  const newItem: Item = {
    id: Date.now(),
    ...dto
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