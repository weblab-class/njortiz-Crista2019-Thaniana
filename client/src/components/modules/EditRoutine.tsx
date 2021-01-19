import NavBar from "../modules/NavBar";
import React, { Component } from "react";
import { RouteComponentProps, navigate } from "@reach/router";
import "./EditRoutine.css";
import User from "../../../../shared/User";

type Props = {
  user: User;
};
type State = {
  loggedIn: boolean;
  value: string;
  duration: number;
  intervals: [];
  isPublic: boolean;
  creator: User;
  owner: User;
  _id: string;
  new_interval: {
    name: string;
    startTime: number;
    endTime: number;
    _id?: string;
  };
}
};

class EditRoutine extends Component<Props & RouteComponentProps, State> {
  constructor(props) {
    super(props);
    this.state = {
        loggedIn: false,
        value: "",
        duration: 0,
        intervals: [],
        isPublic: false,            
        creator: this.props.user,
        owner: this.props.user,
        _id: "",
        new_interval: {
            name: "",
            startTime: 0,
            endTime: 0,
            _id?: ""
        }
    }
  }

  handleNameChange = event => {
      this.setState({
          value: event.target.value,
      });
  };

  togglePublic = event => {
    this.setState({
        isPublic: ! this.state.isPublic,
    });
    console.log(this.state);
    
};

//   handleSubmit = event => {
//       event.preventDefault();
//     //   this.props.onSubmit && this.props.onSubmit(this.state.value);
//       this.setState({
//           value: "",
//       });
//   };

addInterval = event => {

}

  render() {
    if (!this.props.user) {
      navigate(-1);
      return null;
    }
    return (
      <>
      <div className="container">
          {/* main form */}
        <div>
            <form>
                <label>
                    <p>Routine Name:</p>
                    <input type="text" value={this.state.value} onChange={this.handleNameChange}></input>
                </label>
                <label>
                    <p>Make Private?</p>
                    <input type="checkbox" checked={this.state.isPublic} onChange={this.togglePublic}></input>
                </label>
                <label>
                    <p>Total Duration: </p>
                    <p>{this.state.duration}</p>
                </label>
            </form>
            <div className="add-interval-btn" onClick={this.addInterval}>add interval</div>
        </div>
      {/* div for adding a new interval */}
        <div>
            <form>
            these will be the interval options
            </form>
            <div>
            submit interval
            </div>
        </div>
      </div>
        {/* <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form> */}
      </>
    );
  }
}

export default EditRoutine;
