import React, { Component } from "react";
import { Link } from "@reach/router";

/**
 * Story is a component that renders creator and content of a story
 */

export interface Routine {
  _id: string;
  name: string;
  creator_id: string;
  content: string;
}

class SingleRoutine extends Component<Routine> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Single-Routine">
        <span className="Single-Routine-Name">{this.props.name}</span>
        <p className="Single-Rountine-type">{this.props.content}</p>
      </div>
    );
  }
}

export default SingleRoutine;
