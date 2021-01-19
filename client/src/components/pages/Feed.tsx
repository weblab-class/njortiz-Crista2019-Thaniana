import NavBar from "../modules/NavBar";
import React, { Component } from "react";
import { RouteComponentProps, navigate } from "@reach/router";
import "./Feed.css";
import SingleRoutine from "../modules/SingleRoutine";
import NewSearch from "../modules/NewSearch"

import { Routine } from "../modules/SingleRoutine";

import { get } from "../../utilities";

import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
  GoogleLogout,
} from "react-google-login";
// import Routine from "./Routine";

import User from "../../../../shared/User";

const GOOGLE_CLIENT_ID = "557034515616-co9vdfbbqi0s9dgiq9l286t9hfa91oim.apps.googleusercontent.com";
type Props = {
  user: User;
  handleLogin: (res: GoogleLoginResponse | GoogleLoginResponseOffline) => void;
  handleLogout: () => void;
};
//does the below set the state, not sure if this is how it is done in typescript
type State = {
  loggedIn: boolean;
  routines: Routine[];
};

class Feed extends Component<Props & RouteComponentProps, State> {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      routines: [],
    };
  }
  componentDidMount() {
    get("/api/public-routines").then((routineObjs: Routine[]) => {
      this.setState({
        routines: routineObjs,
      });
    });
  }

  render() {
    // if (!this.props.user) {
    //   navigate("/");
    //   return null;
    // }
    let routinesList = null;
    const hasStories = this.state.routines.length !== 0;
    if (hasStories) {
      routinesList = this.state.routines.map((routinesObj) => (
        <SingleRoutine
          _id={routinesObj._id}
          name={routinesObj.name}
          creator_id={routinesObj.creator_id}
          content={routinesObj.content} //actually the routine name which I do not see in the database as of now
        />
      ));
    } else {
      routinesList = <div>No stories!</div>;
    }

    return (
      <>
        <NavBar
          handleLogin={this.props.handleLogin}
          handleLogout={this.props.handleLogout}
          user={this.props.user}
        />
        <div className="container">
          <div>
            {routinesList}
            {console.log(JSON.stringify(this.state.routines))}

            {/*           
          <SingleRoutine 
          _id ="123" 
          creator_name ="batman" 
          creator_id="567" 
          content="hi I am fun"/> */}
          </div>
        </div>
      </>
    );
  }
}

export default Feed;
