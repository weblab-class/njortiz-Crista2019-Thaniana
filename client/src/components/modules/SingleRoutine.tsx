import React, { Component } from "react";
import { Link, RouteComponentProps } from "@reach/router";

import Routine from "../../../../shared/Routine";

import "./SingleRoutine.css";

type Props = {
  routine: Routine;
}
class SingleRoutine extends Component<Props & RouteComponentProps> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <li><Link to={`/routines/${this.props.routine._id}`} className="SingleRoutine-item">
          <span className="SingleRoutine-name">{this.props.routine.name}</span> | <span className="SingleRoutine-owner">{this.props.routine.owner.name}</span>
        </Link></li>
    );
  }
}

export default SingleRoutine;
