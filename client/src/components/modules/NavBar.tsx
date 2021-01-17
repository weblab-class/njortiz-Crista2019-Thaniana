import React, { Component } from "react";
import { RouteComponentProps } from "@reach/router";
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
  GoogleLogout,
} from "react-google-login";
import "./NavBar.css";

const GOOGLE_CLIENT_ID = "747028770339-cfhb6js9kp34beoojcm811ijha6kfc4n.apps.googleusercontent.com";
type Props = {
  userId: String;
  handleLogin: (res: GoogleLoginResponse | GoogleLoginResponseOffline) => void;
  handleLogout: () => void;
};
type State = {
  loggedIn: boolean;
};

class NavBar extends Component<Props & RouteComponentProps, State> {
  render() {
    return (
      <>
        <div className="nav">
          <div className="item header">i n t e r v a l s</div>
          <ul className="items">
            <div className="item">
              {this.props.userId ? (
                <GoogleLogout
                  clientId={GOOGLE_CLIENT_ID}
                  buttonText="Logout"
                  onLogoutSuccess={this.props.handleLogout}
                  onFailure={() => console.log(`Failed to logout.`)}
                />
              ) : (
                <GoogleLogin
                  clientId={GOOGLE_CLIENT_ID}
                  buttonText="Login"
                  onSuccess={this.props.handleLogin}
                  onFailure={(err) => console.log(err)}
                />
              )}
            </div>
            <div className="item nav-button"><a href="/dashboard">View Routines</a></div>
            <div className="item nav-button"><a href="/feed">Search</a></div>
          </ul>
        </div>
      </>
    );
  }
}

export default NavBar;
