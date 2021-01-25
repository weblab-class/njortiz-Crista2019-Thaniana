import NavBar from "../modules/NavBar";
import React, { Component } from "react";
import { RouteComponentProps, navigate } from "@reach/router";
import "./Feed.css";
import "../../utilities.css";
import SingleRoutine from "../modules/SingleRoutine";
import NewSearch from "../modules/NewSearch"

import  Routine  from "../../../../shared/Routine";

import { get } from "../../utilities";

import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
  GoogleLogout,
} from "react-google-login";
// import Routine from "./Routine";

import User from "../../../../shared/User";

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

  getSearchResults = event => {
    get("/api/search-routines" , {searchString: event.target.value}).then((routineObjs: Routine[]) => {
      this.setState({
        routines: routineObjs,
      });
    });
  };

  render() {
    // if (!this.props.user) {
    //   navigate("/");
    //   return null;
    // }
    let routinesList = null;
    const hasStories = this.state.routines.length !== 0;
    if (hasStories) {
      routinesList = this.state.routines.map((routinesObj) => (
        <SingleRoutine key={routinesObj._id} routine={routinesObj}/>
      ));
    } else {
      routinesList = "No routines match your search.";
    }


    return (
      <>
        <NavBar
          handleLogin={this.props.handleLogin}
          handleLogout={this.props.handleLogout}
          user={this.props.user}
        />
        <h1 className="u-textCenter">Search Community Routines</h1>
        <div className="Searchbox">
        <i className="fas fa-search" />
          <input className= "inputbox" type = 'text' onChange = {this.getSearchResults} />
        </div>
        <div className="container">
          <ul>
            {routinesList}
            {/* {console.log(JSON.stringify(this.state.routines))} */}

            {/*           
          <SingleRoutine 
          _id ="123" 
          creator_name ="batman" 
          creator_id="567" 
          content="hi I am fun"/> */}
          </ul>
        </div>
      </>
    );
  }
}

export default Feed;
