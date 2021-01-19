import React, { Component } from "react";
import { navigate, Router } from "@reach/router";
import { get, post } from "../utilities";
import NotFound from "./pages/NotFound";
import Skeleton from './pages/Skeleton';
import LandingPage from "./pages/LandingPage";
import Feed from "./pages/Feed";
import Dashboard from "./pages/Dashboard";
import CreateRoutine from "./pages/CreateRoutine";
import RoutinePage from "./pages/RoutinePage";
import { GoogleLoginResponse } from "react-google-login";
import { socket } from "../client-socket";
import User from "../../../shared/User";
import "../utilities.css";

type State = {
  user: User;
};

class App extends Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
    };
  }

  componentDidMount() {
    get("/api/whoami")
      .then((user: User) => {
        if (user) {
          // TRhey are registed in the database and currently logged in.
          this.setState({ user: user});
        }
      })
      .then(() =>
        socket.on("connect", () => {
          post("/api/initsocket", { socketid: socket.id });
        })
      );
  }

  handleLogin = (res: GoogleLoginResponse) => {
    console.log(`Logged in as ${res.profileObj.name}`);
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user: User) => {
      this.setState({ user: user });
      navigate("/dashboard"); 
    });
  };

  handleLogout = () => {
    this.setState({ user: undefined });
    post("/api/logout");
    navigate("/")
  };

  render() {
    // NOTE:
    // All the pages need to have the props defined in RouteComponentProps for @reach/router to work properly. Please use the Skeleton as an example.
    return (
      <>
        {/* <NavBar
          handleLogin={this.handleLogin}
          handleLogout={this.handleLogout}
          userId={this.state.userId}
        /> */}
        <div>
          <Router>
            <LandingPage path="/" handleLogin={this.handleLogin} handleLogout={this.handleLogout} user={this.state.user}/>
            <Feed path="/feed" handleLogin={this.handleLogin} handleLogout={this.handleLogout} user={this.state.user}/>
            <Dashboard path="/dashboard" handleLogin={this.handleLogin} handleLogout={this.handleLogout} user={this.state.user}/>
            <RoutinePage path="/routines/:routineId" handleLogin={this.handleLogin} handleLogout={this.handleLogout} user={this.state.user}/>
            <CreateRoutine path="/new_routine" handleLogin={this.handleLogin} handleLogout={this.handleLogout} user={this.state.user}/>
            <Skeleton path="/shouldntneed" handleLogin={this.handleLogin} handleLogout={this.handleLogout} userId={this.state.user?._id}/>
            <NotFound default={true} />
          </Router>
        </div>
      </>
    );
  }
}

export default App;
