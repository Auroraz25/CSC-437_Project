import { Schema, model } from "mongoose";
import { Comment } from "../models/comment";

const CommentSchema = new Schema<Comment>(
  {
    id: { type: String, required: true, unique: true, trim: true },
    bookId: { type: String, required: true, trim: true },
    userId: { type: String, required: true, trim: true },
    date: { type: Date, default: Date.now },
    rating: { 
      type: Number, 
      required: true,
      min: 1,
      max: 5
    },
    content: { type: String, required: true },
    favoriteQuote: { type: String }
  },
  { collection: "comments" }
);

const CommentModel = model<Comment>("Comment", CommentSchema);

function index(): Promise<Comment[]> {
  return CommentModel.find();
}

function get(id: string): Promise<Comment> {
  return CommentModel.findOne({ id })
    .then((comment) => {
      if (!comment) throw `Comment with ID ${id} Not Found`;
      return comment;
    });
}

function getByBook(bookId: string): Promise<Comment[]> {
  return CommentModel.find({ bookId });
}

function getByUser(userId: string): Promise<Comment[]> {
  return CommentModel.find({ userId });
}

function create(comment: Comment): Promise<Comment> {
  if (!comment.id) {
    comment.id = `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  if (!comment.date) {
    comment.date = new Date();
  }
  
  return CommentModel.create(comment);
}

function update(id: string, comment: Partial<Comment>): Promise<Comment> {
  delete comment.id;
  
  return CommentModel.findOneAndUpdate({ id }, comment, { new: true })
    .then((updated) => {
      if (!updated) throw `Comment with ID ${id} Not Found`;
      return updated;
    });
}

function remove(id: string): Promise<void> {
  return CommentModel.findOneAndDelete({ id })
    .then((deleted) => {
      if (!deleted) throw `Comment with ID ${id} Not Found`;
    });
}

export default { index, get, getByBook, getByUser, create, update, remove };