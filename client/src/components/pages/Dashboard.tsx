import NavBar from "../modules/NavBar";
import React, { Component } from 'react';
import { navigate, RouteComponentProps } from "@reach/router";
import "./Dashboard.css";
import GoogleLogin, {
    GoogleLoginResponse,
    GoogleLoginResponseOffline,
    GoogleLogout,
  } from "react-google-login";

import RoutineList from "../modules/RoutineList";
import User from "../../../../shared/User";

const GOOGLE_CLIENT_ID = "747028770339-cfhb6js9kp34beoojcm811ijha6kfc4n.apps.googleusercontent.com";
type Props = {
  user: User;
  handleLogin: (res: GoogleLoginResponse | GoogleLoginResponseOffline) => void;
  handleLogout: () => void;
};

type State = {
  loggedIn: boolean;
};

class Dashboard extends Component<Props & RouteComponentProps, State> {
    constructor(props) {
      super(props);
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
        <div
          className="Profile-Pic-Container"
        >
          <div className="Profile-Pic" />
        </div>
        <div className="center-text">
        <h1 className="Profile-name">{this.props.user.name}'s Routines</h1>
        </div>
        <hr/>
        <div className="center-text">
          <RoutineList user={this.props.user} />
        </div>
        </>
      )
    }
  }
  
  export default Dashboard;