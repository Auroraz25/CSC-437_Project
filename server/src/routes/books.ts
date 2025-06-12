import express, { Request, Response } from "express";
import { Book } from "../models/book";
import Books from "../services/book-svc";

const router = express.Router();

router.get("/", (_, res: Response) => {
  Books.index()
    .then((list: Book[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  Books.get(id)
    .then((book: Book) => res.json(book))
    .catch((err) => res.status(404).send(err));
});

router.get("/author/:authorId", (req: Request, res: Response) => {
  const { authorId } = req.params;

  Books.getByAuthor(authorId)
    .then((books: Book[]) => res.json(books))
    .catch((err) => res.status(500).send(err));
});

router.get("/category/:categoryId", (req: Request, res: Response) => {
  const { categoryId } = req.params;

  Books.getByCategory(categoryId)
    .then((books: Book[]) => res.json(books))
    .catch((err) => res.status(500).send(err));
});

router.get("/status/:statusId", (req: Request, res: Response) => {
  const { statusId } = req.params;

  Books.getByStatus(statusId)
    .then((books: Book[]) => res.json(books))
    .catch((err) => res.status(500).send(err));
});

router.post("/", (req: Request, res: Response) => {
  const newBook = req.body;
  Books.create(newBook)
    .then((book: Book) => res.status(201).json(book))
    .catch((err) => res.status(500).send(err));
});

router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const newBook = req.body;

  Books.update(id, newBook)
    .then((book: Book) => res.json(book))
    .catch((err) => res.status(404).send(err));
});

router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  Books.remove(id)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

export default router;