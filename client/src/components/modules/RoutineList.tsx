import React, { Component } from "react";
import { RouteComponentProps, Link } from "@reach/router";
import Routine from "../../../../shared/Routine";
import User from "../../../../shared/User";
import { get, post } from "../../utilities";

import "./RoutineList.css";

type Props = {
  user: User;
};
type State = {
  routines: Routine[];
};

class RoutineList extends Component<Props & RouteComponentProps, State> {
    constructor(props) {
        super(props);
        this.state = {
            routines: [],
        }
    }

    componentDidMount() {
       get("/api/saved-routines").then((routines: Routine[]) => {
           this.setState({
               routines: routines,
           })
       }) 
    }

    render() {
        return (
            <ul>
                {this.state.routines.map(routine => 
                <li key={routine._id}>
                    <Link to={`/routines/${routine._id}`} className="RoutineList-item">{routine.name}</Link>
                </li>)}
            </ul>
        );
    }
   
}

export default RoutineList;