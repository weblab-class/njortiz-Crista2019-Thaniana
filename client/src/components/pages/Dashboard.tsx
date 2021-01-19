import NavBar from "../modules/NavBar";
import React, { Component } from "react";
import { navigate, RouteComponentProps, Link } from "@reach/router";
import "./Dashboard.css";
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
  GoogleLogout,
} from "react-google-login";

import RoutineList from "../modules/RoutineList";
import User from "../../../../shared/User";

const GOOGLE_CLIENT_ID = "557034515616-co9vdfbbqi0s9dgiq9l286t9hfa91oim.apps.googleusercontent.com";
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
        <div className="Profile-Pic-Container">
          <div className="Profile-Pic" />
        </div>
        <div className="center-text">
          <h1 className="Profile-name">{this.props.user?.name}'s Routines</h1>
        </div>
        <hr />
        <div className="center-text">
          <RoutineList user={this.props.user} />
          <div className="item-right">
            <div className="add-routine">
              <Link to="/new_routine">+</Link>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Dashboard;
