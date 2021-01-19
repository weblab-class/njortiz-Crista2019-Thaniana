import React, { Component } from "react";
import { RouteComponentProps, Link } from "@reach/router";
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
  GoogleLogout,
} from "react-google-login";
import "./NavBar.css";
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

class NavBar extends Component<Props & RouteComponentProps, State> {
  render() {
    return (
      <>
        <div className="nav">
          <div className="item header">i n t e r v a l s</div>
          <ul className="items">
            <div className="item">
              {this.props.user ? (
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
            <div className="item nav-button"><Link to="/dashboard">View Routines</Link></div>
            <div className="item nav-button"><Link to="/feed">Search</Link></div>
          </ul>
        </div>
      </>
    );
  }
}

export default NavBar;
