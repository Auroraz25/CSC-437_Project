import { Schema, model } from "mongoose";
import { Status, StatusType } from "../models/status";

const StatusSchema = new Schema<Status>(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    type: { 
      type: String, 
      required: true, 
      enum: ['read', 'reading', 'to-read'],
      default: 'to-read'
    },
    description: { type: String }
  },
  { collection: "statuses" }
);

const StatusModel = model<Status>("Status", StatusSchema);

function index(): Promise<Status[]> {
  return StatusModel.find();
}

function get(id: string): Promise<Status> {
  return StatusModel.findOne({ id })
    .then((status) => {
      if (!status) throw `Status with ID ${id} Not Found`;
      return status;
    });
}

function getByType(type: StatusType): Promise<Status | null> {
  return StatusModel.findOne({ type });
}

function create(status: Status): Promise<Status> {
  return StatusModel.create(status);
}

function update(id: string, status: Partial<Status>): Promise<Status> {
  return StatusModel.findOneAndUpdate({ id }, status, { new: true })
    .then((updated) => {
      if (!updated) throw `Status with ID ${id} Not Found`;
      return updated;
    });
}

function remove(id: string): Promise<void> {
  return StatusModel.findOneAndDelete({ id })
    .then((deleted) => {
      if (!deleted) throw `Status with ID ${id} Not Found`;
    });
}

export default { index, get, getByType, create, update, remove };