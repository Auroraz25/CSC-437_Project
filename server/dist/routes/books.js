"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var books_exports = {};
__export(books_exports, {
  default: () => books_default
});
module.exports = __toCommonJS(books_exports);
var import_express = __toESM(require("express"));
var import_book_svc = __toESM(require("../services/book-svc"));
const router = import_express.default.Router();
router.get("/", (_, res) => {
  import_book_svc.default.index().then((list) => res.json(list)).catch((err) => res.status(500).send(err));
});
router.get("/:id", (req, res) => {
  const { id } = req.params;
  import_book_svc.default.get(id).then((book) => res.json(book)).catch((err) => res.status(404).send(err));
});
router.get("/author/:authorId", (req, res) => {
  const { authorId } = req.params;
  import_book_svc.default.getByAuthor(authorId).then((books) => res.json(books)).catch((err) => res.status(500).send(err));
});
router.get("/category/:categoryId", (req, res) => {
  const { categoryId } = req.params;
  import_book_svc.default.getByCategory(categoryId).then((books) => res.json(books)).catch((err) => res.status(500).send(err));
});
router.get("/status/:statusId", (req, res) => {
  const { statusId } = req.params;
  import_book_svc.default.getByStatus(statusId).then((books) => res.json(books)).catch((err) => res.status(500).send(err));
});
router.post("/", (req, res) => {
  const newBook = req.body;
  console.log("Creating new book:", newBook);
  import_book_svc.default.create(newBook).then((book) => res.status(201).json(book)).catch((err) => res.status(500).send(err));
});
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const newBook = req.body;
  import_book_svc.default.update(id, newBook).then((book) => res.json(book)).catch((err) => res.status(404).send(err));
});
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  import_book_svc.default.remove(id).then(() => res.status(204).end()).catch((err) => res.status(404).send(err));
});
var books_default = router;
