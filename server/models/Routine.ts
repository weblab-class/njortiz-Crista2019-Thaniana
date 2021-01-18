import { Schema, model, Document } from "mongoose";
import { User, UserSchema } from "./User";

/*
The Interval ranges over [startTime, endTime).
All times are in seconds, based on the overall routine timeline.

(e.g., startTime = 0 means it's the first interval. endTime = 120
means this interval ends at 2 minutes and the next starts at 2 minutes)
 */
const IntervalSchema = new Schema({
    name: String,
    startTime: Number, 
    endTime: Number, 
});

const RoutineSchema = new Schema({
  name: String,
  duration: Number, 
  intervals: [IntervalSchema],
  isPublic: Boolean,
  creator: UserSchema, // User object representing the routine's original creator
  owner: UserSchema, // User object representing whoever has the routine saved
});

export interface Interval extends Document {
  name: string;
  startTime: number;
  endTime: number;
  _id?: string;
}

export interface Routine extends Document {
    name: string;
    duration: number;
    intervals: Interval[];
    isPublic: boolean;
    creator: User;
    owner: User;
    _id: string;
}

const RoutineModel = model<Routine>("Routine", RoutineSchema);

module.exports =  RoutineModel;