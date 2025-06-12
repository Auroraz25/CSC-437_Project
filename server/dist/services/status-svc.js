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
var status_svc_exports = {};
__export(status_svc_exports, {
  default: () => status_svc_default
});
module.exports = __toCommonJS(status_svc_exports);
var import_mongoose = require("mongoose");
const StatusSchema = new import_mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ["read", "reading", "to-read"],
      default: "to-read"
    },
    description: { type: String }
  },
  { collection: "statuses" }
);
const StatusModel = (0, import_mongoose.model)("Status", StatusSchema);
function index() {
  return StatusModel.find();
}
function get(id) {
  return StatusModel.findOne({ id }).then((status) => {
    if (!status) throw `Status with ID ${id} Not Found`;
    return status;
  });
}
function getByType(type) {
  return StatusModel.findOne({ type });
}
function create(status) {
  return StatusModel.create(status);
}
function update(id, status) {
  return StatusModel.findOneAndUpdate({ id }, status, { new: true }).then((updated) => {
    if (!updated) throw `Status with ID ${id} Not Found`;
    return updated;
  });
}
function remove(id) {
  return StatusModel.findOneAndDelete({ id }).then((deleted) => {
    if (!deleted) throw `Status with ID ${id} Not Found`;
  });
}
var status_svc_default = { index, get, getByType, create, update, remove };
