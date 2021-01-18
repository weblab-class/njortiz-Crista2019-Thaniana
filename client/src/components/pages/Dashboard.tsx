import NavBar from "../modules/NavBar";
import React, { Component } from 'react';
import { RouteComponentProps } from "@reach/router";
import "./Dashboard.css";
import GoogleLogin, {
    GoogleLoginResponse,
    GoogleLoginResponseOffline,
    GoogleLogout,
  } from "react-google-login";

const GOOGLE_CLIENT_ID = "747028770339-cfhb6js9kp34beoojcm811ijha6kfc4n.apps.googleusercontent.com";
type Props = {
  userId: String;
  handleLogin: (res: GoogleLoginResponse | GoogleLoginResponseOffline) => void;
  handleLogout: () => void;
};

type State = {
  loggedIn: boolean;
};

class Dashboard extends Component<Props & RouteComponentProps, State> {
    render() {
      return (
        <>
          <NavBar
          handleLogin={this.props.handleLogin}
          handleLogout={this.props.handleLogout}
          userId={this.props.userId}
        />
        <div
          className="Profile-Pic-Container"
        >
          <div className="Profile-Pic" />
        </div>
        <div className="center-text">
        <h1 className="Profile-name">Batman's Routines(hardcoded currently)</h1>
        </div>
        <hr/>
        <div className="center-text">
          <div>Routine1</div>
          <div>Routine2</div>
          <div>Routine3</div>
          <div>Routine4</div>
        </div>
        </>
      )
    }
  }
  
  export default Dashboard;