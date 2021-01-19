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
  isTimerRunning: boolean;
  secondsElapsed: number;
  currentInterval: Interval;
};

class RoutinePage extends Component<Props & RouteComponentProps, State> {
    constructor(props) {
      super(props);
      this.state = {
          routine: null,
          isTimerRunning: false,
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
            <li>Intervals: {this.state.routine?.intervals.map((interval: Interval) => {interval.name})}</li>
            <li>Current Interval: {this.state.currentInterval?.name}</li>
            <li>Seconds Elapsed: {this.state.secondsElapsed}</li>
        </ul>
        </>
      )
    }
  }
  
  export default RoutinePage;