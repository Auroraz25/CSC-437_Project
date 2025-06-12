"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var book_svc_exports = {};
__export(book_svc_exports, {
  default: () => book_svc_default
});
module.exports = __toCommonJS(book_svc_exports);
var import_mongoose = require("mongoose");
var import_uuid = require("uuid");
const BookSchema = new import_mongoose.Schema(
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
const BookModel = (0, import_mongoose.model)("Book", BookSchema);
function index() {
  return BookModel.find();
}
function get(id) {
  return BookModel.findOne({ id }).then((book) => {
    if (!book) throw `Book with ID ${id} Not Found`;
    return book;
  });
}
function getByAuthor(authorId) {
  return BookModel.find({ authorId });
}
function getByCategory(categoryId) {
  return BookModel.find({ categoryId });
}
function getByStatus(statusId) {
  return BookModel.find({ statusId });
}
function create(book) {
  const bookWithId = {
    ...book,
    id: (0, import_uuid.v4)()
  };
  return BookModel.create(bookWithId);
}
function update(id, book) {
  return BookModel.findOneAndUpdate({ id }, book, { new: true }).then((updated) => {
    if (!updated) throw `Book with ID ${id} Not Found`;
    return updated;
  });
}
function remove(id) {
  return BookModel.findOneAndDelete({ id }).then((deleted) => {
    if (!deleted) throw `Book with ID ${id} Not Found`;
  });
}
var book_svc_default = { index, get, getByAuthor, getByCategory, getByStatus, create, update, remove };
