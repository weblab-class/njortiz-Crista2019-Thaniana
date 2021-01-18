import NavBar from "../modules/NavBar";
import React, { Component } from 'react';
import { RouteComponentProps, navigate } from "@reach/router";
import "./CreateRoutine.css";
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

class CreateRoutine extends Component<Props & RouteComponentProps, State> {
    constructor(props) {
      super(props);
    }

    render() {
      if (!this.props.userId) {
        navigate(-1);
      }
      return (
        <>
          <NavBar
          handleLogin={this.props.handleLogin}
          handleLogout={this.props.handleLogout}
          userId={this.props.userId}
        />
        </>
      )
    }
  }
  
  export default CreateRoutine;