import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "../data.json");

if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, "[]");
}

export const readData = () => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const writeData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};