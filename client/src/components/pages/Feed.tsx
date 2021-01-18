import NavBar from "../modules/NavBar";
import React, { Component } from 'react';
import { RouteComponentProps } from "@reach/router";
import "./Feed.css";
import SingleRoutine from "../modules/SingleRoutine.tsx";

import { get } from "../../utilities";

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
//does the below set the state, not sure if this is how it is done in typescript 
type State = {
  loggedIn: boolean;
  routines: Array<State>;
};



class Feed extends Component<Props & RouteComponentProps, State> {
  constructor(props){
    super(props);
    this.state = {
      loggedIn: false,
      routines: [],
    }
  }
  componentDidMount() {
    get("/api/public-routines").then((routineObjs) => {
      this.setState({
        routines:routineObjs,
      });
    });
  }

    render() {

      return (
        
        <>
          <NavBar
          handleLogin={this.props.handleLogin}
          handleLogout={this.props.handleLogout}
          userId={this.props.userId}
          />
        <div>
          {console.log(JSON.stringify(this.state.routines))}
          <SingleRoutine 
          _id ="123" 
          creator_name ="batman" 
          creator_id="567" 
          content="hi I am fun"/>
        </div>
        </>
      )
    }
  }
  
  export default Feed;