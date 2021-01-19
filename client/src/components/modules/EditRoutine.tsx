import NavBar from "../modules/NavBar";
import React, { Component } from "react";
import { RouteComponentProps, navigate } from "@reach/router";
import "./EditRoutine.css";
import User from "../../../../shared/User";
import Slider from "react-rangeslider";
import 'react-rangeslider/lib/index.css'


type Props = {
  user: User;
};
type State = {
  loggedIn: boolean;
  name: string;
  duration: number;
  intervals: [];
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
      loggedIn: false,
      name: "",
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

  //   handleSubmit = event => {
  //       event.preventDefault();
  //     //   this.props.onSubmit && this.props.onSubmit(this.state.value);
  //       this.setState({
  //           value: "",
  //       });
  //   };

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

  updateIntervalTime = value => {
    this.setState({
        x: value,
      });
  }

  // submit the interva; object to the array in state
  submitInterval = (event) => {
    // reset states for adding new interval data
    this.setState({
      showAddInterval: !this.state.showAddInterval,
      interval_name: "",
      interval_start_time: this.state.interval_end_time,
      interval_end_time: this.state.interval_end_time + this.state.x,
      duration: this.state.duration + this.state.x,
      x: 0
    });
    console.log(this.state)
  };

  // save the routine
  saveRoutine = (event) => {};

  render() {
    if (!this.props.user) {
      navigate(-1);
      return null;
    }
    return (
      <>
        <div className="container">
          {/* main form */}
          <div>
            <form>
              <label>
                <p>Routine Name:</p>
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
                    <p>Duration (minutes):</p>
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
                <div className="btn" onClick={this.submitInterval}>
                  Add To Routine
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
