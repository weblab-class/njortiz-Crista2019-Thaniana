import express from "express";
import auth from "./auth";
import socketManager from "./server-socket";
const router = express.Router();

const Routine = require("./models/Routine");
import User from "./models/User";
import RoutineInterface from "../shared/Routine";
import UserInterface from "../shared/User";

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // Not logged in.
    return res.send({});
  }
  res.send(req.user);
});
router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user) {
    const socket = socketManager.getSocketFromSocketID(req.body.socketid);
    if (socket !== undefined) socketManager.addUser(req.user, socket);
  }
  res.send({});
});

// uses req.user to return array of all routines saved by that user
router.get("/saved-routines", (req, res) => {
  if (!req.user) {
    throw new Error("You must be logged in to access your saved routines.");
  }
  Routine.find({ owner_id: req.user._id }).then((routines: RoutineInterface[]) => {
    res.send(routines);
  })
});

// takes { searchString: string } as parameter and returns array of all public routines with name similar to searchString
router.get("/search-routines", (req, res) => {
  Routine.find({ name: {$regex: req.query.searchString, $options: "i"}, isPublic: true }).then((routines: RoutineInterface[]) => {
    res.send(routines);
  })
});

// takes no inputs and returns a list of all public routines
router.get("/public-routines", (req, res) => {
  Routine.find({ isPublic: true }).then((routines: RoutineInterface[]) => res.send(routines));
});

// takes { name: string, duration: number, intervals: Interval[], isPublic: boolean } as parameters
// creates new Routine to add to the database, using req.user
router.post("/new-routine", (req, res) => {
  if (!req.user) {
    throw new Error("You must be logged in to create a new routine.");
  }
  const newRoutine = new Routine({
    name: req.body.name,
    duration: req.body.duration,
    intervals: req.body.intervals,
    isPublic: req.body.isPublic,
    creator_id: req.user._id,
    owner_id: req.user._id,
  });
  newRoutine.save().then((routine: RoutineInterface) => res.send(routine));
});

// takes { originalRoutine_id: string } and saves a copy of the routine, with its owner changed to req.user
router.post("/save-routine", (req, res) => {
  if (!req.user) {
    throw new Error("You must be logged in to save a routine.");
  }
  Routine.findById(req.body.originalRoutine_id).then((originalRoutine: RoutineInterface) => {
    if (!originalRoutine.isPublic) {
      throw new Error("You cannot save a private routine.")
    }
    if (originalRoutine.creator_id == req.user?._id) {
      throw new Error("You already own this routine.")
    }
    User.findById(originalRoutine.creator_id).then((user: UserInterface) => {
      const newName = `${originalRoutine.name} (created by: ${user.name})`;
      const copyRoutine = new Routine({
        name: newName,
        duration: originalRoutine.duration,
        intervals: originalRoutine.intervals,
        isPublic: false,
        creator_id: originalRoutine.creator_id,
        owner_id: req.user?._id,
      });

      copyRoutine.save().then((routine: RoutineInterface) => res.send(routine));
    });
  });
});

// takes { routine: Routine } as parameter and updates the Routine with the same _id to have the new parameters
router.post("/edit-routine", (req, res) => {
  const updatedRoutine = req.body.routine;
  if (!req.user) {
    throw new Error("You must be logged in to edit a routine.");
  }
  if (updatedRoutine.owner_id != req.user._id) {
    throw new Error("Not allowed to edit another user's routine.");
  }
  else { 
    Routine.findById(updatedRoutine._id).then((routine: RoutineInterface) => {
    routine.name = updatedRoutine.name;
    routine.duration = updatedRoutine.duration;
    routine.intervals = updatedRoutine.intervals;
    routine.isPublic = updatedRoutine.isPublic;
    routine.save().then((savedRoutine: RoutineInterface) => res.send(savedRoutine));
    });
  }
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  const msg = `Api route not found: ${req.method} ${req.url}`;
  res.status(404).send({ msg });
});

export default router;
