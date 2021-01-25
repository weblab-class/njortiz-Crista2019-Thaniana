import NavBar from "../modules/NavBar";
import EditRoutine from "../modules/EditRoutine";
import React, { Component } from "react";
import { RouteComponentProps, navigate } from "@reach/router";
import "./CreateRoutine.css";
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
  GoogleLogout,
} from "react-google-login";
import User from "../../../../shared/User";

type Props = {
  user: User;
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
        <EditRoutine user={this.props.user}></EditRoutine>
      </>
    );
  }
}

export default CreateRoutine;
