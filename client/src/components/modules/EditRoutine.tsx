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
  showAddInterval: boolean;
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
        showAddInterval: false,
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

// show form for adding a new interval
addInterval = event => {
    this.setState({
        showAddInterval: ! this.state.showAddInterval,
    });
}

// submit the interva; object to the array in state
submitInterval = event => {
    this.setState({
        showAddInterval: ! this.state.showAddInterval,
    });
}

// save the routine
saveRoutine = event => {
    
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
        </div>
        <div>
            {/* div for adding a new interval */}
        {this.state.showAddInterval ? 
            <div>
                <form>
                these will be the interval options
                </form>
                <div className="btn" onClick={this.submitInterval}>Add To Routine</div>
            </div>
        :
            <div className="btn" onClick={this.addInterval}>New Interval</div>
        }
        </div>
      </div>
      <div className="container">
        <div className="btn submit" onClick={this.saveRoutine}>Save</div>
      </div>
      </>
    );
  }
}

export default EditRoutine;
