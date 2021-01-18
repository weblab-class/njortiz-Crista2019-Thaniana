import { Schema, model, Document } from "mongoose";

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
  creator_id: String, // _id of the User who originally created the routine
  owner_id: String, // _id of the User that has this routine saved
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
    creator_id: string;
    owner_id: string;
    _id?: string;
}

const RoutineModel = model<Routine>("Routine", RoutineSchema);

module.exports =  RoutineModel;