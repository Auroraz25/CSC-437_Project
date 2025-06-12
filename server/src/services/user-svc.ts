import { Schema, model } from "mongoose";
import { User } from "../models/user";

const UserSchema = new Schema<User>(
  {
    id: { type: String, required: true, unique: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    avatar: { type: String }
  },
  { collection: "users" }
);

const UserModel = model<User>("User", UserSchema);

function index(): Promise<User[]> {
  return UserModel.find().select('-password'); // 确保不返回密码字段
}

function get(id: string): Promise<User> {
  return UserModel.findOne({ id }).select('-password')
    .then((user) => {
      if (!user) throw `User with ID ${id} Not Found`;
      return user;
    });
}

function getByUsername(username: string): Promise<User> {
  return UserModel.findOne({ username }).select('-password')
    .then((user) => {
      if (!user) throw `User with username ${username} Not Found`;
      return user;
    });
}

function create(user: User): Promise<User> {
  return UserModel.create(user)
    .then(createdUser => {
      const userObject = createdUser.toObject();
      delete userObject.password;
      return userObject as User;
    });
}

function update(id: string, user: Partial<User>): Promise<User> {
  return UserModel.findOneAndUpdate({ id }, user, { new: true }).select('-password')
    .then((updated) => {
      if (!updated) throw `User with ID ${id} Not Found`;
      return updated;
    });
}

function remove(id: string): Promise<void> {
  return UserModel.findOneAndDelete({ id })
    .then((deleted) => {
      if (!deleted) throw `User with ID ${id} Not Found`;
    });
}

export default { index, get, getByUsername, create, update, remove };