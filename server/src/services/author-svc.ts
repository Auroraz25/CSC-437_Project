import { Schema, model } from "mongoose";
import { Author } from "../models/author";
import { v4 as uuidv4 } from 'uuid';

const AuthorSchema = new Schema<Author>(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    nationality: { type: String, trim: true },
    birthYear: { type: Number },
    deathYear: { type: Number },
    bio: { type: String },
    photoUrl: { type: String }
  },
  { collection: "authors" }
);

const AuthorModel = model<Author>("Author", AuthorSchema);

function index(): Promise<Author[]> {
  return AuthorModel.find();
}

function get(id: string): Promise<Author> {
  return AuthorModel.findOne({ id })
    .then((author) => {
      if (!author) throw `Author with ID ${id} Not Found`;
      return author;
    });
}

function create(author: Omit<Author, 'id'>): Promise<Author> {
  const authorWithId = {
    ...author,
    id: uuidv4() 
  };
  return AuthorModel.create(authorWithId);
}
function update(id: string, author: Partial<Author>): Promise<Author> {
  return AuthorModel.findOneAndUpdate({ id }, author, { new: true })
    .then((updated) => {
      if (!updated) throw `Author with ID ${id} Not Found`;
      return updated;
    });
}

function remove(id: string): Promise<void> {
  return AuthorModel.findOneAndDelete({ id })
    .then((deleted) => {
      if (!deleted) throw `Author with ID ${id} Not Found`;
    });
}

export default { index, get, create, update, remove };