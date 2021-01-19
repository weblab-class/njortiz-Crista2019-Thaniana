import NavBar from "../modules/NavBar";
import React, { Component } from "react";
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
    this.state = {
      name: "New Routine",
      duration: 0,
      intervals: [],
      isPublic: false,
      creator: this.props.user,
      owner: this.props.user,
      _id: "",
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
      x: value,
      interval_end_time: this.state.interval_start_time + value,
    });
  };

  // submit the interva; object to the array in state
  submitInterval = (event) => {
    // make interval object and add to array in state
    let IntervalObject = {
      name: this.state.interval_name,
      // conversation from minutes into seconds
      startTime: this.state.interval_start_time * 60,
      endTime: this.state.interval_end_time * 60,
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

  // save the routine: this entails making an api call to send the Routine state to the DB as a new user routine and then clearing the states completely
  saveRoutine = (event) => {

    // converting duration to seconds
    this.setState({
        duration: this.state.duration * 60,
    });

    // API send should occur now

    // clearing the state for a new routine 
    // TODO:
    // (once this is refactored to be edit, this shouldn't matter since these values will get passed in at the begining as either empty as follows for new routines 
    // or preloaded, which means the routines need to be made deletable/editable rather than just listed)
      get("/api/saved-routines").then((routines: Routine[]) => {
        for (let routine of routines) {
          // TODO: show error message when trying to create a routine with a pre-existing name
          if (routine.name === this.state.name) {
            return;
          }
        }
        
        if (this.state._id === "") { // this is a new routine since it has no id
          post("/api/new-routine", { 
            name: this.state.name, 
            duration: this.state.duration, 
            intervals: this.state.intervals, 
            isPublic: this.state.isPublic
          }).then(() => navigate(-1))
        }
        else {
          post("/api/edit-routine", {
            routine: {
              name: this.state.name,
              duration: this.state.duration,
              intervals: this.state.intervals,
              isPublic: this.state.isPublic,
              owner: this.state.owner,
              creator: this.state.creator,
              _id: this.state._id,
            }
          }).then(() => navigate(-1));
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
                <input type="text" value={this.state.name} onChange={this.handleNameChange}></input>
              </label>
              <label>
                <p>Make Public?</p>
                <input
                  type="checkbox"
                  checked={this.state.isPublic}
                  onChange={this.togglePublic}
                ></input>
              </label>
              <label>
                <p>Total Duration: </p>
                <p>{this.state.duration}</p>
              </label>
            </form>
          </div>
          <hr />
          <h3>Intervals in {this.state.name}:</h3>
          {/* list out all the added intervals */}
          <div>
            {this.state.intervals.map(function (d, idx) {
              return <li key={idx}><i>{d.name} | {(d.endTime - d.startTime) / 60} min</i></li>;
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
                      onChange={this.handleIntNameChange}
                    ></input>
                  </label>
                  <label>
                    <p>Duration: {this.state.x} Minutes</p>
                    <div className="slider">
                      <Slider
                        min={0}
                        max={60}
                        value={this.state.x}
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
              <div className="btn" onClick={this.addInterval}>
                New Interval
              </div>
            )}
          </div>
        </div>
        <div className="container">
          <div className="btn submit" onClick={this.saveRoutine}>
            Save
          </div>
        </div>
      </>
    );
  }
}

export default EditRoutine;