import { Schema, model } from "mongoose";
import { Book } from "../models/book";
import { v4 as uuidv4 } from 'uuid';

const BookSchema = new Schema<Book>(
  {
    id: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    authorId: { type: String, required: true, trim: true },
    published: { type: Number },
    pages: { type: Number },
    isbn: { type: String, trim: true },
    categoryId: { type: String, trim: true },
    statusId: { type: String, trim: true },
    description: { type: String },
    coverUrl: { type: String }
  },
  { collection: "books" }
);

const BookModel = model<Book>("Book", BookSchema);

function index(): Promise<Book[]> {
  return BookModel.find();
}

function get(id: string): Promise<Book> {
  return BookModel.findOne({ id })
    .then((book) => {
      if (!book) throw `Book with ID ${id} Not Found`;
      return book;
    });
}

function getByAuthor(authorId: string): Promise<Book[]> {
  return BookModel.find({ authorId });
}

function getByCategory(categoryId: string): Promise<Book[]> {
  return BookModel.find({ categoryId });
}

function getByStatus(statusId: string): Promise<Book[]> {
  return BookModel.find({ statusId });
}

function create(book: Book): Promise<Book> {
  const bookWithId = {
    ...book,
    id: uuidv4()
  };
  return BookModel.create(bookWithId);
}

function update(id: string, book: Partial<Book>): Promise<Book> {
  return BookModel.findOneAndUpdate({ id }, book, { new: true })
    .then((updated) => {
      if (!updated) throw `Book with ID ${id} Not Found`;
      return updated;
    });
}

function remove(id: string): Promise<void> {
  return BookModel.findOneAndDelete({ id })
    .then((deleted) => {
      if (!deleted) throw `Book with ID ${id} Not Found`;
    });
}

export default { index, get, getByAuthor, getByCategory, getByStatus, create, update, remove };
