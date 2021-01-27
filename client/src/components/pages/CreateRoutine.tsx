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
import Routine from "../../../../shared/Routine";

type Props = {
  user: User;
  handleLogin: (res: GoogleLoginResponse | GoogleLoginResponseOffline) => void;
  handleLogout: () => void;
};
type State = {
  originalRoutine: Routine;
};

class CreateRoutine extends Component<Props & RouteComponentProps, State> {
  constructor(props) {
    super(props);
    this.state = { originalRoutine: props.location.state.routine };
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
        <EditRoutine user={this.props.user} originalRoutine={this.state.originalRoutine}></EditRoutine>
      </>
    );
  }
}

export default CreateRoutine;
