import { v4 as uuidv4 } from "uuid";

export function camelize(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}

export function generateId() {
  return uuidv4();
}

export function generateKey(str) {
  return str
    .replace(/[^a-zA-Z ]/g, "")
    .trim()
    .toLowerCase()
    .replace(" ", "-");
}
