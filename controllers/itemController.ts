import { Request, Response } from "express";
import { readData, writeData } from "../utils/file.js";
import { validate } from "class-validator";
import { Item } from "../types/items.ts";
import { CreateItemDto } from "../DTO/itemDTO.ts";
import { UpdateItemDto } from "../DTO/itemDTO.ts";

export const getItems = (req: Request, res: Response): Response => {
return  res.json(readData());
};

export const createItem = async (req: Request, res: Response): Promise<void> => {
  const dto = new CreateItemDto();

  dto.id = Number(req.body.id);
  dto.name = req.body.name;

  const errors = await validate(dto);

  if (errors.length > 0) {
    res.status(400).json(
      errors.map(err => ({
        field: err.property,
        message: Object.values(err.constraints || {}).toString()
      }))
    );
    return;
  }

  const items: Item[] = readData();

  const existingItem = items.find(item => item.id === dto.id);

  if (existingItem) {
    res.status(400).json({
      field: "id",
      message: "ID already exists"
    });
    return;
  }

  const newItem: Item = {
    id: dto.id,
    name: dto.name
  };

  items.push(newItem);

  writeData(items);

  res.status(201).json(newItem);
};


export const updateItem = async (req: Request, res: Response): Promise<void> => {
  const dto = new UpdateItemDto();
  dto.id = Number(req.params.id);
  dto.name = req.body.name;

  const errors = await validate(dto);

  if (errors.length > 0) {
    res.status(400).json(
      errors.map(err => ({
        field: err.property,
        message: Object.values(err.constraints || {}).join(", ")
      }))
    );
    return;
  }

  const items = readData();
  const id = Number(req.params.id);

  const index = items.findIndex(item => item.id === id);

  if (index === -1) {
    res.status(404).json({
      message: "Item not found"
    });
    return;
  }

  items[index].name = dto.name;

  writeData(items);

  res.status(200).json({
    message: "Item updated successfully",
    item: items[index]
  });
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