import { Schema, model } from "mongoose";
import { Category } from "../models/category";
import { v4 as uuidv4 } from 'uuid';

const CategorySchema = new Schema<Category>(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String },
    iconId: { type: String }
  },
  { collection: "categories" }
);

const CategoryModel = model<Category>("Category", CategorySchema);

function index(): Promise<Category[]> {
  return CategoryModel.find();
}

function get(id: string): Promise<Category> {
  return CategoryModel.findOne({ id })
    .then((category) => {
      if (!category) throw `Category with ID ${id} Not Found`;
      return category;
    });
}

function create(category: Omit<Category, 'id'>): Promise<Category> {
  const categoryWithId = {
    ...category,
    id: uuidv4() 
  };
  return CategoryModel.create(categoryWithId);
}

function update(id: string, category: Partial<Category>): Promise<Category> {
  return CategoryModel.findOneAndUpdate({ id }, category, { new: true })
    .then((updated) => {
      if (!updated) throw `Category with ID ${id} Not Found`;
      return updated;
    });
}

function remove(id: string): Promise<void> {
  return CategoryModel.findOneAndDelete({ id })
    .then((deleted) => {
      if (!deleted) throw `Category with ID ${id} Not Found`;
    });
}

export default { index, get, create, update, remove };