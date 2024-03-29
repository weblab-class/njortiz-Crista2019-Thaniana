import NavBar from "../modules/NavBar";
import React, { Component } from "react";
import "./RoutinePage.css";
import { Popup } from "semantic-ui-react";
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

  getData = () => {
    get("/api/single-routine", { routineId: this.props.routineId }).then((routine: Routine) => {
      this.setState({
        routine: routine,
      });
    });
  };
  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.routineId !== this.props.routineId) {
      this.getData();
    }
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

      post("/api/save-routine", { originalRoutine_id: this.props.routineId }).then(
        (copyRoutine: Routine) => {
          navigate(`/routines/${copyRoutine._id}`);
        }
      );
    });
  };

  deleteRoutine = () => {
    post("/api/delete-routine", { routineId: this.props.routineId }).then(() =>
      navigate("/dashboard")
    );
  };

  getCurrentInterval = (): Interval => {
    if (!this.state.timer && this.state.secondsElapsed === 0) {
      return null;
    }

    for (let interval of this.state.routine?.intervals) {
      if (
        interval.startTime <= this.state.secondsElapsed &&
        this.state.secondsElapsed < interval.endTime
      ) {
        return interval;
      }
    }
    return null;
  };

  startTimer = (): void => {
    if (!this.state.timer) {
      this.setState({
        timer: setInterval(() => {
          if (this.state.secondsElapsed === this.state.routine.duration) {
            clearInterval(this.state.timer);
            this.setState({ timer: null });
          } else {
            this.setState({ secondsElapsed: this.state.secondsElapsed + 1 });
          }
        }, 1000),
      });
    }
  };

  pauseTimer = (): void => {
    if (this.state.timer) {
      clearInterval(this.state.timer);
      this.setState({
        timer: null,
      });
    }
  };

  restartTimer = (): void => {
    this.setState({
      secondsElapsed: 0,
    });
  };

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
            <li><h2>{this.state.routine?.name}</h2></li>
            <li>
              Routine Duration: {Math.trunc(this.state.routine?.duration / 3600)} h :{" "}
              {Math.trunc(
                (this.state.routine?.duration / 3600 -
                  Math.trunc(this.state.routine?.duration / 3600)) *
                  60
              )}{" "}
              m : 0 s
            </li>
            <li>
              Remaining Intervals:{" "}
              {this.state.routine?.intervals.map((interval: Interval) => (
                <div className="interval" key={interval.startTime}>
                  {interval.name}{" "}
                </div>
              ))}
            </li>
            <li>Current Interval: <strong>{this.getCurrentInterval()?.name}</strong></li>
            <li>
              Time Elapsed: <strong>{Math.trunc(this.state.secondsElapsed / 3600)} h :{" "}
              {Math.trunc(
                (this.state.secondsElapsed / 3600 - Math.trunc(this.state.secondsElapsed / 3600)) *
                  60
              )}{" "}
              m : {this.state.secondsElapsed % 60} s</strong>
            </li>

            <Popup
              trigger={
                <button className="routine-control-btn" onClick={this.startTimer}>
                  &#x25B6;
                </button>
              }
              position="bottom center"
            >
              <pre className="tooltip-bottom">Start Routine</pre>
            </Popup>

            <Popup
              trigger={
                <button className="routine-control-btn" onClick={this.pauseTimer}>
                  &#9995;
                </button>
              }
              position="bottom center"
            >
              <pre className="tooltip-bottom">Pause Routine</pre>
            </Popup>

            <Popup
              trigger={
                <button className="routine-control-btn" onClick={this.restartTimer}>
                  &#9201;
                </button>
              }
              position="bottom center"
            >
              <pre className="tooltip-bottom">Reset Routine</pre>
            </Popup>

            {this.props.user?._id == this.state.routine?.owner._id ? (
              <Popup
                trigger={
                  <button
                    className="routine-control-btn"
                    onClick={() => {
                      navigate("/new_routine", {
                        state: {
                          routine: {
                            name: this.state.routine?.name,
                            duration: this.state.routine?.duration,
                            intervals: this.state.routine?.intervals,
                            isPublic: this.state.routine?.isPublic,
                            creator: this.state.routine?.creator,
                            owner: this.state.routine?.owner,
                            _id: this.state.routine?._id,
                          },
                        },
                      });
                    }}
                  >
                    &#9998;
                  </button>
                }
                position="bottom center"
              >
                <pre className="tooltip-bottom">Edit Routine</pre>
              </Popup>
            ) : (
              <></>
            )}

            <Popup
              trigger={
                this.state.routine?.owner?._id != this.props.user?._id ? (
                  <button className="routine-control-btn" onClick={this.saveRoutine}>
                    &#128190;
                  </button>
                ) : null
              }
              position="bottom center"
            >
              <pre className="tooltip-bottom">Save to Dashboard</pre>
            </Popup>
            <Popup
              trigger={
                this.state.routine?.owner?._id == this.props.user?._id ? (
                  <button className="routine-control-btn" onClick={this.deleteRoutine}>
                    &#9940;
                  </button>
                ) : null
              }
              position="bottom center"
            >
              <pre className="tooltip-bottom">Delete Routine</pre>
            </Popup>
          </ul>
        </div>
      </>
    );
  }
}

export default RoutinePage;
