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
var comment_svc_exports = {};
__export(comment_svc_exports, {
  default: () => comment_svc_default
});
module.exports = __toCommonJS(comment_svc_exports);
var import_mongoose = require("mongoose");
const CommentSchema = new import_mongoose.Schema(
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
const CommentModel = (0, import_mongoose.model)("Comment", CommentSchema);
function index() {
  return CommentModel.find();
}
function get(id) {
  return CommentModel.findOne({ id }).then((comment) => {
    if (!comment) throw `Comment with ID ${id} Not Found`;
    return comment;
  });
}
function getByBook(bookId) {
  return CommentModel.find({ bookId });
}
function getByUser(userId) {
  return CommentModel.find({ userId });
}
function create(comment) {
  if (!comment.id) {
    comment.id = `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  if (!comment.date) {
    comment.date = /* @__PURE__ */ new Date();
  }
  return CommentModel.create(comment);
}
function update(id, comment) {
  delete comment.id;
  return CommentModel.findOneAndUpdate({ id }, comment, { new: true }).then((updated) => {
    if (!updated) throw `Comment with ID ${id} Not Found`;
    return updated;
  });
}
function remove(id) {
  return CommentModel.findOneAndDelete({ id }).then((deleted) => {
    if (!deleted) throw `Comment with ID ${id} Not Found`;
  });
}
var comment_svc_default = { index, get, getByBook, getByUser, create, update, remove };
