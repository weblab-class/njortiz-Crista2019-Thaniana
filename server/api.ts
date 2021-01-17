import express from "express";
import auth from "./auth";
import socketManager from "./server-socket";
const router = express.Router();

const User = require("./models/User.ts");
const Routine = require("./models/Routine.ts");

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

// takes { owner_id: string } as parameter and returns array of all routines saved by that user
router.get("/saved-routines", (req, res) => {
  Routine.find({ owner_id: req.query.owner_id }).then((routines) => {
    res.send(routines);
  })
})

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  const msg = `Api route not found: ${req.method} ${req.url}`;
  res.status(404).send({ msg });
});

export default router;
