"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var import_express = __toESM(require("express"));
var import_mongo = require("./services/mongo");
var import_cors = __toESM(require("cors"));
var import_authors = __toESM(require("./routes/authors"));
var import_books = __toESM(require("./routes/books"));
var import_categories = __toESM(require("./routes/categories"));
var import_comments = __toESM(require("./routes/comments"));
var import_statuses = __toESM(require("./routes/statuses"));
var import_users = __toESM(require("./routes/users"));
var import_auth = __toESM(require("./routes/auth"));
const app = (0, import_express.default)();
const port = process.env.PORT || 3e3;
const staticDir = process.env.STATIC || "public";
(0, import_mongo.connect)("book_collection");
app.use((0, import_cors.default)({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(import_express.default.json());
app.use(import_express.default.static(staticDir));
app.use("/auth", import_auth.default);
app.use("/api/authors", import_auth.authenticateUser, import_authors.default);
app.use("/api/books", import_auth.authenticateUser, import_books.default);
app.use("/api/categories", import_auth.authenticateUser, import_categories.default);
app.use("/api/comments", import_auth.authenticateUser, import_comments.default);
app.use("/api/statuses", import_auth.authenticateUser, import_statuses.default);
app.use("/api/users", import_auth.authenticateUser, import_users.default);
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
