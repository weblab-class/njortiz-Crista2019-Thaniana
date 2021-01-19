import NavBar from "../modules/NavBar";
import React, { Component } from 'react';
import { RouteComponentProps, navigate } from "@reach/router";
import GoogleLogin, {
    GoogleLoginResponse,
    GoogleLoginResponseOffline,
    GoogleLogout,
  } from "react-google-login";
import Routine from "../../../../shared/Routine";
import Interval from "../../../../shared/Interval";
import User from "../../../../shared/User";
import { get } from "../../utilities";


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
          currentInterval: null
      };
    }

    componentDidMount() {
        get("/api/single-routine", { routineId: this.props.routineId }).then((routine: Routine) => {
            this.setState({
                routine: routine
            });
        });
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
      if (!this.props.user) {
        navigate(-1);
        return null;
      }
      return (
        <>
          <NavBar
          handleLogin={this.props.handleLogin}
          handleLogout={this.props.handleLogout}
          user={this.props.user}
        />
        <ul>
            <li>Routine name: {this.state.routine?.name} </li>
            <li>Routine duration: {this.state.routine?.duration}</li>
            <li>Intervals: {this.state.routine?.intervals.map((interval: Interval) => <span key={interval.startTime}>{interval.name} </span>)}</li>
            <li>Current Interval: {this.getCurrentInterval()?.name}</li>
            <li>Seconds Elapsed: {this.state.secondsElapsed}</li>
            <button onClick={this.startTimer}>Start Timer</button>
            <button onClick={this.pauseTimer}>Pause Timer</button>
            <button onClick={this.restartTimer}>Restart Timer</button>
        </ul>
        </>
      )
    }
  }
  
  export default RoutinePage;