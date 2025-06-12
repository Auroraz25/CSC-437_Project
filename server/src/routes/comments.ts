import express, { Request, Response } from "express";
import { Comment } from "../models/comment";
import Comments from "../services/comment-svc";

const router = express.Router();

router.get("/", (_, res: Response) => {
  Comments.index()
    .then((list: Comment[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  Comments.get(id)
    .then((comment: Comment) => res.json(comment))
    .catch((err) => res.status(404).send(err));
});

router.get("/book/:bookId", (req: Request, res: Response) => {
  const { bookId } = req.params;

  Comments.getByBook(bookId)
    .then((comments: Comment[]) => res.json(comments))
    .catch((err) => res.status(500).send(err));
});

router.get("/user/:userId", (req: Request, res: Response) => {
  const { userId } = req.params;

  Comments.getByUser(userId)
    .then((comments: Comment[]) => res.json(comments))
    .catch((err) => res.status(500).send(err));
});

router.post("/", (req: Request, res: Response) => {
  const newComment = req.body;
  
  if (!newComment.rating || !newComment.content || !newComment.bookId) {
    return res.status(400).json({
      error: "Missing required fields",
      required: ["rating", "content", "bookId"]
    });
  }

  if (newComment.rating < 1 || newComment.rating > 5) {
    return res.status(400).json({
      error: "Rating must be between 1 and 5"
    });
  }

  if (!newComment.id) {
    newComment.id = `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  if (!newComment.date) {
    newComment.date = new Date();
  }

  Comments.create(newComment)
    .then((comment: Comment) => res.status(201).json(comment))
    .catch((err) => {
      console.error("Comment creation error:", err);
      res.status(500).json({
        error: "Failed to create comment",
        details: err.message || err
      });
    });
});

router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedComment = req.body;
  if (updatedComment.rating && (updatedComment.rating < 1 || updatedComment.rating > 5)) {
    return res.status(400).json({
      error: "Rating must be between 1 and 5"
    });
  }

  Comments.update(id, updatedComment)
    .then((comment: Comment) => res.json(comment))
    .catch((err) => {
      console.error("Comment update error:", err);
      res.status(404).json({
        error: "Failed to update comment",
        details: err.message || err
      });
    });
});

router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  Comments.remove(id)
    .then(() => res.status(204).end())
    .catch((err) => {
      console.error("Comment deletion error:", err);
      res.status(404).json({
        error: "Failed to delete comment",
        details: err.message || err
      });
    });
});

export default router;