import React, { Component } from 'react';
import { Link, Redirect, RouteComponentProps } from "@reach/router";
import "./LandingPage.css";
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

  class LandingPage extends Component<Props & RouteComponentProps, State> {
    render() {
      // if (this.state.loggedIn === true){return(<a href="/Dashboard"/>)}
      //trying to shift to the dashboard page as soon as we log in, not working not sure why
      return (
        <>
          <div className="container">
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
              <div className="title">
                  i n t e r v a l s
              </div>
              <div className="content">
                  interval scheduling made easy.
              </div>
              <div className="content">
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
              </div>
          </div>
        </>
      )
    }
  }
  
  export default LandingPage;