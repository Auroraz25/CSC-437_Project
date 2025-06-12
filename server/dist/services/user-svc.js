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
var user_svc_exports = {};
__export(user_svc_exports, {
  default: () => user_svc_default
});
module.exports = __toCommonJS(user_svc_exports);
var import_mongoose = require("mongoose");
const UserSchema = new import_mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    avatar: { type: String }
  },
  { collection: "users" }
);
const UserModel = (0, import_mongoose.model)("User", UserSchema);
function index() {
  return UserModel.find().select("-password");
}
function get(id) {
  return UserModel.findOne({ id }).select("-password").then((user) => {
    if (!user) throw `User with ID ${id} Not Found`;
    return user;
  });
}
function getByUsername(username) {
  return UserModel.findOne({ username }).select("-password").then((user) => {
    if (!user) throw `User with username ${username} Not Found`;
    return user;
  });
}
function create(user) {
  return UserModel.create(user).then((createdUser) => {
    const userObject = createdUser.toObject();
    delete userObject.password;
    return userObject;
  });
}
function update(id, user) {
  return UserModel.findOneAndUpdate({ id }, user, { new: true }).select("-password").then((updated) => {
    if (!updated) throw `User with ID ${id} Not Found`;
    return updated;
  });
}
function remove(id) {
  return UserModel.findOneAndDelete({ id }).then((deleted) => {
    if (!deleted) throw `User with ID ${id} Not Found`;
  });
}
var user_svc_default = { index, get, getByUsername, create, update, remove };
