import NavBar from "../modules/NavBar";
import React, { Component } from 'react';
import "./RoutinePage.css";
import { RouteComponentProps, navigate } from "@reach/router";
import GoogleLogin, {
    GoogleLoginResponse,
    GoogleLoginResponseOffline,
    GoogleLogout,
  } from "react-google-login";
import Routine from "../../../../shared/Routine";
import Interval from "../../../../shared/Interval";
import User from "../../../../shared/User";
import { get, post } from "../../utilities";


type Props = {
  user: User;
  routineId?: string; // had to make this optional cause of weird TS error with route params
  handleLogin: (res: GoogleLoginResponse | GoogleLoginResponseOffline) => void;
  handleLogout: () => void;
};
type State = {
  routine: Routine;
  timer: NodeJS.Timeout;
  secondsElapsed: number;
  currentInterval: Interval;
};

class RoutinePage extends Component<Props & RouteComponentProps, State> {
    constructor(props) {
      super(props);
      this.state = {
          routine: null,
          timer: null,
          secondsElapsed: 0,
          currentInterval: null,
      };
    }

    componentDidMount() {
        get("/api/single-routine", { routineId: this.props.routineId }).then((routine: Routine) => {
            this.setState({
                routine: routine
            });
        });
    }
    
    saveRoutine = () => {
      const newName: string = `${this.state.routine?.name} (created by: ${this.state.routine?.creator.name})`;
      get("/api/saved-routines").then((routines: Routine[]) => {
        if (this.state.routine.owner._id == this.props.user._id) {
          alert("You already own this routine.");
          return;
        }
        for (let routine of routines) {
          if (routine.name === newName) {
            alert("You already have a routine with the name " + newName);
            return;
          }
        }

        post("/api/save-routine", { originalRoutine_id: this.props.routineId })
        .then((copyRoutine: Routine) => {
          console.log("hello!!!!");
          console.log(copyRoutine._id);
          navigate(`/routines/${copyRoutine._id}`);
        });
      });
    }

    deleteRoutine = () {
      post("/api/delete-routine", { routineId: this.props.routineId }).then(() => navigate("/dashboard"));
    }

    getCurrentInterval = (): Interval => {
      if (!this.state.timer && this.state.secondsElapsed === 0) {
        return null;
      }

      for (let interval of this.state.routine?.intervals) {
        if (interval.startTime <= this.state.secondsElapsed && this.state.secondsElapsed < interval.endTime) {
          return interval;
        }
      }
      return null;
    }

    startTimer = (): void => {
      if (!this.state.timer) {
        this.setState({
          timer: setInterval(() => {
            if (this.state.secondsElapsed === this.state.routine.duration) {
              clearInterval(this.state.timer);
              this.setState({timer: null });
            } else {
              this.setState({ secondsElapsed: this.state.secondsElapsed + 1})
            }
          }, 1000)
        });
      }
    }

    pauseTimer = (): void => {
      if (this.state.timer) {
        clearInterval(this.state.timer);
        this.setState({
          timer: null,
        });
      }
    }

    restartTimer = (): void => {
      this.setState({
        secondsElapsed: 0,
      })
    }

    render() {
      // if (!this.props.user) {
      //   navigate("/");
      //   return null;
      // }
      return (
        <>
          <NavBar
          handleLogin={this.props.handleLogin}
          handleLogout={this.props.handleLogout}
          user={this.props.user}
        />
        <div className="container">
        <ul>
            <li>Routine name: {this.state.routine?.name} </li>
            <li>Routine duration: {Math.trunc(this.state.routine?.duration / 3600)} h : {Math.trunc(((this.state.routine?.duration / 3600) - Math.trunc(this.state.routine?.duration / 3600)) * 60)} m : 0 s</li>
            <li>Remaining Intervals: {this.state.routine?.intervals.map((interval: Interval) => <div className="interval" key={interval.startTime}>{interval.name} </div>)}</li>
            <li>Current Interval: {this.getCurrentInterval()?.name}</li>
            <li>Time Elapsed: {Math.trunc(this.state.secondsElapsed / 3600)} h : {Math.trunc(((this.state.secondsElapsed / 3600) - Math.trunc(this.state.secondsElapsed / 3600)) * 60)} m : {this.state.secondsElapsed % 60} s</li>
            <button onClick={this.startTimer}>Start Timer</button>
            <button onClick={this.pauseTimer}>Pause Timer</button>
            <button onClick={this.restartTimer}>Restart Timer</button>
            {this.props.user?._id == this.state.routine?.owner._id ?<button 
              onClick={() => {
                navigate("/new_routine", { state: { routine: {
                  name: this.state.routine?.name,
                  duration: this.state.routine?.duration,
                  intervals: this.state.routine?.intervals,
                  isPublic: this.state.routine?.isPublic,
                  creator: this.state.routine?.creator,
                  owner: this.state.routine?.owner,
                  _id: this.state.routine?._id,
                }}});
              }}>Edit</button> : <></>}
            {this.state.routine?.owner?._id != this.props.user?._id ? 
              <button onClick={this.saveRoutine}>Save to Dashboard</button> : null}
            {this.state.routine?.owner?._id == this.props.user?._id ?
              <button onClick={this.deleteRoutine}>Delete Routine</button> : null}
        </ul>
        </div>
        </>
      )
    }
  }
  
  export default RoutinePage;