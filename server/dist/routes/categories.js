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
var categories_exports = {};
__export(categories_exports, {
  default: () => categories_default
});
module.exports = __toCommonJS(categories_exports);
var import_express = __toESM(require("express"));
var import_category_svc = __toESM(require("../services/category-svc"));
const router = import_express.default.Router();
router.get("/", (_, res) => {
  import_category_svc.default.index().then((list) => res.json(list)).catch((err) => res.status(500).send(err));
});
router.get("/:id", (req, res) => {
  const { id } = req.params;
  import_category_svc.default.get(id).then((category) => res.json(category)).catch((err) => res.status(404).send(err));
});
router.post("/", (req, res) => {
  const newCategory = req.body;
  import_category_svc.default.create(newCategory).then((category) => res.status(201).json(category)).catch((err) => res.status(500).send(err));
});
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const newCategory = req.body;
  import_category_svc.default.update(id, newCategory).then((category) => res.json(category)).catch((err) => res.status(404).send(err));
});
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  import_category_svc.default.remove(id).then(() => res.status(204).end()).catch((err) => res.status(404).send(err));
});
var categories_default = router;
