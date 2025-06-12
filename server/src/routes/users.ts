import express, { Request, Response } from "express";
import { User } from "../models/user";
import Users from "../services/user-svc";

const router = express.Router();

router.get("/", (_, res: Response) => {
  Users.index()
    .then((list: User[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  Users.get(id)
    .then((user: User) => res.json(user))
    .catch((err) => res.status(404).send(err));
});

router.get("/username/:username", (req: Request, res: Response) => {
  const { username } = req.params;

  Users.getByUsername(username)
    .then((user: User) => res.json(user))
    .catch((err) => res.status(404).send(err));
});

router.post("/", (req: Request, res: Response) => {
  const newUser = req.body;

  Users.create(newUser)
    .then((user: User) => res.status(201).json(user))
    .catch((err) => res.status(500).send(err));
});

router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const newUser = req.body;

  Users.update(id, newUser)
    .then((user: User) => res.json(user))
    .catch((err) => res.status(404).send(err));
});

router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  Users.remove(id)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

export default router;