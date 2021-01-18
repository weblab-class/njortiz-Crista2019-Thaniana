import React, { Component } from "react";
import { RouteComponentProps } from "@reach/router";
import Routine from "../../../../shared/Routine";
import User from "../../../../shared/User";
import { get, post } from "../../utilities";

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
                {this.state.routines.map(routine => <li>{routine.name}</li>)}
            </ul>
        );
    }
   
}

export default RoutineList;