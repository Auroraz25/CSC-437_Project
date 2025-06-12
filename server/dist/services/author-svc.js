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
var author_svc_exports = {};
__export(author_svc_exports, {
  default: () => author_svc_default
});
module.exports = __toCommonJS(author_svc_exports);
var import_mongoose = require("mongoose");
var import_uuid = require("uuid");
const AuthorSchema = new import_mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    nationality: { type: String, trim: true },
    birthYear: { type: Number },
    deathYear: { type: Number },
    bio: { type: String },
    photoUrl: { type: String }
  },
  { collection: "authors" }
);
const AuthorModel = (0, import_mongoose.model)("Author", AuthorSchema);
function index() {
  return AuthorModel.find();
}
function get(id) {
  return AuthorModel.findOne({ id }).then((author) => {
    if (!author) throw `Author with ID ${id} Not Found`;
    return author;
  });
}
function create(author) {
  const authorWithId = {
    ...author,
    id: (0, import_uuid.v4)()
  };
  return AuthorModel.create(authorWithId);
}
function update(id, author) {
  return AuthorModel.findOneAndUpdate({ id }, author, { new: true }).then((updated) => {
    if (!updated) throw `Author with ID ${id} Not Found`;
    return updated;
  });
}
function remove(id) {
  return AuthorModel.findOneAndDelete({ id }).then((deleted) => {
    if (!deleted) throw `Author with ID ${id} Not Found`;
  });
}
var author_svc_default = { index, get, create, update, remove };
