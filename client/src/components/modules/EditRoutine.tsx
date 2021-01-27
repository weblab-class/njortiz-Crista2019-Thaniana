import NavBar from "../modules/NavBar";
import React, { Component } from "react";
import { Popup } from "semantic-ui-react";
import { RouteComponentProps, navigate } from "@reach/router";
import "./EditRoutine.css";
import User from "../../../../shared/User";
import Routine from "../../../../shared/Routine";
import Slider from "react-rangeslider";
import "react-rangeslider/lib/index.css";
import { get, post } from "../../utilities";

interface Interval {
  name: string;
  startTime: number;
  endTime: number;
}

type Props = {
  user: User;
  originalRoutine?: Routine;
};
type State = {
  name: string;
  duration: number;
  intervals: Interval[];
  isPublic: boolean;
  creator: User;
  owner: User;
  _id: string;
  showAddInterval: boolean;
  interval_name: string;
  interval_start_time: number;
  interval_end_time: number;
  x: number;
};

class EditRoutine extends Component<Props & RouteComponentProps, State> {
  constructor(props) {
    super(props);
    const original = this.props.originalRoutine;
    this.state = {
      name: original ? original.name : "New Routine",
      duration: original ? original.duration : 0,
      intervals: original ? original.intervals : [],
      isPublic: original ? original.isPublic : false,
      creator: original ? original.creator : this.props.user,
      owner: this.props.user,
      _id: original ? original._id : "",
      showAddInterval: false,
      interval_name: "",
      interval_start_time: 0,
      interval_end_time: 0,
      x: 0,
    };
  }

  handleNameChange = (event) => {
    this.setState({
      name: event.target.value,
    });
  };

  // restricts input to letters and numbers but no special characters
  restrictInput = (event) => {
    const regex = new RegExp("^[a-zA-Z0-9 ]");
    const key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
      event.preventDefault();
      return false;
    }
  };

  togglePublic = (event) => {
    this.setState({
      isPublic: !this.state.isPublic,
    });
    console.log(this.state);
  };

  // show form for adding a new interval
  addInterval = (event) => {
    this.setState({
      showAddInterval: !this.state.showAddInterval,
    });
  };

  handleIntNameChange = (event) => {
    this.setState({
      interval_name: event.target.value,
    });
  };

  updateIntervalTime = (value) => {
    this.setState({
      x: value*60,
      interval_end_time: this.state.interval_start_time + value*60,
    });
  };

  // submit the interva; object to the array in state
  submitInterval = (event) => {
    // make interval object and add to array in state
    let IntervalObject = {
      name: this.state.interval_name,
      startTime: this.state.interval_start_time,
      endTime: this.state.interval_end_time,
    };

    // reset states for adding new interval data
    this.setState({
      showAddInterval: !this.state.showAddInterval,
      interval_name: "",
      interval_start_time: this.state.interval_end_time,
      interval_end_time: this.state.interval_end_time,
      duration: this.state.duration + this.state.x,
      x: 0,
      intervals: this.state.intervals.concat(IntervalObject),
    });
    console.log(this.state);
  };

  deleteInterval = (index: number) => {
    const newIntervals: Interval[] = [...this.state.intervals];
    const oldDuration: number = newIntervals[index].endTime - newIntervals[index].startTime
    newIntervals.splice(index, 1);
    // shift timing of subsequent intervals back
    for (let i = index; i < newIntervals.length; i++) {
      newIntervals[i].startTime -= oldDuration;
      newIntervals[i].endTime -= oldDuration;
    }

    this.setState({
      intervals: newIntervals,
      duration: this.state.duration - oldDuration
    });
  }

  // save the routine: this entails making an api call to send the Routine state to the DB as a new user routine and then clearing the states completely
  saveRoutine = (event) => {
    // API send should occur now

    // clearing the state for a new routine
    // TODO:
    // (once this is refactored to be edit, this shouldn't matter since these values will get passed in at the begining as either empty as follows for new routines
    // or preloaded, which means the routines need to be made deletable/editable rather than just listed)
    get("/api/saved-routines").then((routines: Routine[]) => {
      for (let routine of routines) {
        // TODO: show error message when trying to create a routine with a pre-existing name
        if (routine._id !== this.state._id && routine.name === this.state.name) {
          return;
        }
      }

      console.log(this.state._id);

      if (this.state._id === "") {
        // this is a new routine since it has no id
        post("/api/new-routine", {
          name: this.state.name,
          duration: this.state.duration,
          intervals: this.state.intervals,
          isPublic: this.state.isPublic,
        }).then((routine: Routine) => navigate(`/routines/${routine._id}`));
      } else {
        post("/api/edit-routine", {
          routine: {
            name: this.state.name,
            duration: this.state.duration,
            intervals: this.state.intervals,
            isPublic: this.state.isPublic,
            owner: this.state.owner,
            creator: this.state.creator,
            _id: this.state._id,
          },
        }).then((routine: Routine) => navigate(`/routines/${routine._id}`));
      }
    });
  };

  render() {
    if (!this.props.user) {
      navigate("/");
      return null;
    }
    return (
      <>
        <div className="container">
          {/* main form */}
          <div>
            <form>
              <label>
                <h3>Routine Name:</h3>
                <Popup
                  trigger={
                    <input
                      type="text"
                      onKeyPress={this.restrictInput}
                      value={this.state.name}
                      onChange={this.handleNameChange}
                    ></input>
                  }
                  position="right center"
                >
                  <pre className="tooltip-right">
                    Give your routine a name! (please use numbers/letters only, no special
                    characters)
                  </pre>
                </Popup>
              </label>
              <label>
                <p>Make Public?</p>
                <Popup
                  trigger={
                    <input
                      type="checkbox"
                      checked={this.state.isPublic}
                      onChange={this.togglePublic}
                    ></input>
                  }
                  position="right center"
                >
                  <pre className="tooltip-right">Check this box to make your routine public to all Intervals users</pre>
                </Popup>
              </label>
              <label>
                <p>Total Duration: </p>
                <p>{this.state.duration / 60} Minutes</p>
              </label>
            </form>
          </div>
          <hr />
          <h3>Intervals in {this.state.name}:</h3>
          {/* list out all the added intervals */}
          <div>
            {this.state.intervals.map((d, idx) => {
              console.log("this:" + this);
              return (
                <li className="interval-item" key={idx}>
                  <i>
                    {d.name} | {(d.endTime - d.startTime) / 60} min
                  </i>
                  <span onClick={() => this.deleteInterval(idx)} className="btn-delete">X</span>
                </li>
              );
            })}
          </div>
          <hr />
          <div>
            {/* div for adding a new interval */}
            {this.state.showAddInterval ? (
              <div>
                <form>
                  <label>
                    <p>Interval Name: </p>
                    <input
                      type="text"
                      value={this.state.interval_name}
                      onKeyPress={this.restrictInput}
                      onChange={this.handleIntNameChange}
                    ></input>
                  </label>
                  <label>
                    <p>Duration: {this.state.x / 60} Minutes</p>
                    <div className="slider">
                      <Slider
                        min={0}
                        max={60}
                        value={this.state.x / 60}
                        onChange={this.updateIntervalTime}
                      />
                    </div>
                  </label>
                </form>
                <div className="btn-inline">
                  <div className="btn" onClick={this.submitInterval}>
                    Add To Routine
                  </div>
                  <div className="btn cancel" onClick={this.addInterval}>
                    Cancel
                  </div>
                </div>
              </div>
            ) : (
              <Popup
              trigger = {
                <div className="btn" onClick={this.addInterval}>
                New Interval
              </div>
              }
              position="left center"
              >
                <pre className="tooltip-left">Add another step to your routine?</pre>
              </Popup>
            )}
          </div>
        </div>
        <div className="container">
          <Popup 
          trigger = {
            <div className="btn submit" onClick={this.saveRoutine}>
            Save
          </div>
          }
          position="right center"
          >
            <pre className="tooltip-right">Save this routine?</pre>
          </Popup>
        </div>
      </>
    );
  }
}

export default EditRoutine;
