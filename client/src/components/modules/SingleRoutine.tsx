import React, { Component } from "react";
import { Link, RouteComponentProps } from "@reach/router";

import Routine from "../../../../shared/Routine";

type Props = {
  routine: Routine;
}
class SingleRoutine extends Component<Props & RouteComponentProps> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Single-Routine">
        <Link to={`/routines/${this.props.routine._id}`} className="Single-Routine-Name"><strong>{this.props.routine.name}</strong> | {this.props.routine.owner.name} </Link>
      </div>
    );
  }
}

export default SingleRoutine;
