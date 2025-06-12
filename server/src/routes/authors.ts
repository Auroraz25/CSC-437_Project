import express, { Request, Response } from "express";
import { Author } from "../models/author";
import Authors from "../services/author-svc";

const router = express.Router();

router.get("/", (_, res: Response) => {
  Authors.index()
    .then((list: Author[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  Authors.get(id)
    .then((author: Author) => res.json(author))
    .catch((err) => res.status(404).send(err));
});

router.post("/", (req: Request, res: Response) => {
  const newAuthor = req.body;
  console.log(newAuthor)
  Authors.create(newAuthor)
    .then((author: Author) => res.status(201).json(author))
    .catch((err) => res.status(500).send(err));
});

router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const newAuthor = req.body;

  Authors.update(id, newAuthor)
    .then((author: Author) => res.json(author))
    .catch((err) => res.status(404).send(err));
});

router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  Authors.remove(id)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

export default router;