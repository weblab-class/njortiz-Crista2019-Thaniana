import "./NewSearch.css";
import React, { Component } from "react";
import { post } from "../../utilities";


/**
 * New Post is a parent component for all input components
 */

interface NewPostInputProps {
  defaultText: string;
  onSubmit: (value: string) => void;
}

interface NewPostInputState {
  value: string;
}

class NewPostInput extends Component<NewPostInputProps, NewPostInputState> {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
    };
  }

  // called whenever the user types in the new post input box
  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      value: event.target.value,
    });
  };


  // called when the user hits "Submit" for a new post
  handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    this.props.onSubmit && this.props.onSubmit(this.state.value);
    this.setState({
      value: "",
    });
  };

  render() {
    return (
      <div className="u-flex">
        <input
          type="text"
          placeholder={this.props.defaultText}
          value={this.state.value}
          onChange={this.handleChange}
          className="NewPostInput-input"
        />
        <button
          type="submit"
          className="NewPostInput-button u-pointer"
          value="Submit"
          onClick={this.handleSubmit}
        >
          Submit
        </button>
      </div>
    );
  }
}

export interface Search {
    routine_name: string;
}

interface NewSearchProps {
    addNewStory: (search: Search) => void;
  }
  
  class NewSearch extends Component<NewSearchProps> {
    addStory = (value: string) => {
      const body = { content: value };
      post("/api/story", body).then((search) => {
        // display this story on the screen
        this.props.addNewStory(search);
      });
    };
  
    render() {
      return <NewPostInput defaultText="Search" onSubmit={this.addStory} />;
    }
  }

  export default NewSearch;