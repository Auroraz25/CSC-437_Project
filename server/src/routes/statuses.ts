import express, { Request, Response } from "express";
import { Status } from "../models/status";
import Statuses from "../services/status-svc";

const router = express.Router();

router.get("/", (_, res: Response) => {
  Statuses.index()
    .then((list: Status[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  Statuses.get(id)
    .then((status: Status) => res.json(status))
    .catch((err) => res.status(404).send(err));
});

router.get("/type/:type", (req: Request, res: Response) => {
  const { type } = req.params;

  if (type === 'read' || type === 'reading' || type === 'to-read') {
    Statuses.getByType(type)
      .then((status) => {
        if (status) {
          res.json(status);
        } else {
          res.status(404).send(`No status found with type ${type}`);
        }
      })
      .catch((err) => res.status(500).send(err));
  } else {
    res.status(400).send('Invalid status type');
  }
});

router.post("/", (req: Request, res: Response) => {
  const newStatus = req.body;

  Statuses.create(newStatus)
    .then((status: Status) => res.status(201).json(status))
    .catch((err) => res.status(500).send(err));
});

router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const newStatus = req.body;

  Statuses.update(id, newStatus)
    .then((status: Status) => res.json(status))
    .catch((err) => res.status(404).send(err));
});

router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  Statuses.remove(id)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

export default router;