import express, { Request, Response } from "express";
import { Category } from "../models/category";
import Categories from "../services/category-svc";

const router = express.Router();

router.get("/", (_, res: Response) => {
  Categories.index()
    .then((list: Category[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  Categories.get(id)
    .then((category: Category) => res.json(category))
    .catch((err) => res.status(404).send(err));
});

router.post("/", (req: Request, res: Response) => {
  const newCategory = req.body;

  Categories.create(newCategory)
    .then((category: Category) => res.status(201).json(category))
    .catch((err) => res.status(500).send(err));
});

router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const newCategory = req.body;

  Categories.update(id, newCategory)
    .then((category: Category) => res.json(category))
    .catch((err) => res.status(404).send(err));
});

router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  Categories.remove(id)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

export default router;