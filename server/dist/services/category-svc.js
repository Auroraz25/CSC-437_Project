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
var category_svc_exports = {};
__export(category_svc_exports, {
  default: () => category_svc_default
});
module.exports = __toCommonJS(category_svc_exports);
var import_mongoose = require("mongoose");
var import_uuid = require("uuid");
const CategorySchema = new import_mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String },
    iconId: { type: String }
  },
  { collection: "categories" }
);
const CategoryModel = (0, import_mongoose.model)("Category", CategorySchema);
function index() {
  return CategoryModel.find();
}
function get(id) {
  return CategoryModel.findOne({ id }).then((category) => {
    if (!category) throw `Category with ID ${id} Not Found`;
    return category;
  });
}
function create(category) {
  const categoryWithId = {
    ...category,
    id: (0, import_uuid.v4)()
  };
  return CategoryModel.create(categoryWithId);
}
function update(id, category) {
  return CategoryModel.findOneAndUpdate({ id }, category, { new: true }).then((updated) => {
    if (!updated) throw `Category with ID ${id} Not Found`;
    return updated;
  });
}
function remove(id) {
  return CategoryModel.findOneAndDelete({ id }).then((deleted) => {
    if (!deleted) throw `Category with ID ${id} Not Found`;
  });
}
var category_svc_default = { index, get, create, update, remove };
