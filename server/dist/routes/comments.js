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
var comments_exports = {};
__export(comments_exports, {
  default: () => comments_default
});
module.exports = __toCommonJS(comments_exports);
var import_express = __toESM(require("express"));
var import_comment_svc = __toESM(require("../services/comment-svc"));
const router = import_express.default.Router();
router.get("/", (_, res) => {
  import_comment_svc.default.index().then((list) => res.json(list)).catch((err) => res.status(500).send(err));
});
router.get("/:id", (req, res) => {
  const { id } = req.params;
  import_comment_svc.default.get(id).then((comment) => res.json(comment)).catch((err) => res.status(404).send(err));
});
router.get("/book/:bookId", (req, res) => {
  const { bookId } = req.params;
  import_comment_svc.default.getByBook(bookId).then((comments) => res.json(comments)).catch((err) => res.status(500).send(err));
});
router.get("/user/:userId", (req, res) => {
  const { userId } = req.params;
  import_comment_svc.default.getByUser(userId).then((comments) => res.json(comments)).catch((err) => res.status(500).send(err));
});
router.post("/", (req, res) => {
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
    newComment.date = /* @__PURE__ */ new Date();
  }
  import_comment_svc.default.create(newComment).then((comment) => res.status(201).json(comment)).catch((err) => {
    console.error("Comment creation error:", err);
    res.status(500).json({
      error: "Failed to create comment",
      details: err.message || err
    });
  });
});
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const updatedComment = req.body;
  if (updatedComment.rating && (updatedComment.rating < 1 || updatedComment.rating > 5)) {
    return res.status(400).json({
      error: "Rating must be between 1 and 5"
    });
  }
  import_comment_svc.default.update(id, updatedComment).then((comment) => res.json(comment)).catch((err) => {
    console.error("Comment update error:", err);
    res.status(404).json({
      error: "Failed to update comment",
      details: err.message || err
    });
  });
});
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  import_comment_svc.default.remove(id).then(() => res.status(204).end()).catch((err) => {
    console.error("Comment deletion error:", err);
    res.status(404).json({
      error: "Failed to delete comment",
      details: err.message || err
    });
  });
});
var comments_default = router;
