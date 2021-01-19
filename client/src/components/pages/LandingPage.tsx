import React, { Component } from "react";
import { Link, navigate, Redirect, RouteComponentProps } from "@reach/router";
import "./LandingPage.css";
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
  GoogleLogout,
} from "react-google-login";
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

class LandingPage extends Component<Props & RouteComponentProps, State> {
  render() {
    // if (this.props.user) {
    //   navigate("/dashboard");
    //   return null;
    // }
    return (
      <>
        <div className="landing-container">
          <div className="side-divs">
            <div className="rect" id="rect1"></div>
            <div className="rect" id="rect2"></div>
            <div className="rect" id="rect3"></div>
            <div className="rect" id="rect4"></div>
            <div className="rect" id="rect5"></div>
            <div className="rect" id="rect6"></div>
            <div className="rect" id="rect7"></div>
            <div className="rect" id="rect8"></div>
          </div>
          <div className="center-text">
            <div className="title">i n t e r v a l s</div>
            <div className="content">interval scheduling made easy.</div>
            <div className="content">
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
          </div>
        </div>
      </>
    );
  }
}

export default LandingPage;
