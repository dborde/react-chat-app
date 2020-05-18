import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
// import io from "socket.io-client";

// const ENDPOINT = "http://localhost:5000";
// const socket = io(ENDPOINT);

const initialState = {
  username: '',
  room: ''
}

class Join extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState
    }
  }

  clearForm() {
    this.setState({
      ...initialState
    });
  }

  onInputUpdate = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });
  }

  join = () => {
    const { username, room } = this.state;
    if (username && room) {
      this.props.history.push(`/chat/${username}/${room}`)
    }
  }

  render() {
    const { username, room } = this.state;
    return (
      <div className="row">
        <div className="col-xs">
          <form className="centered-form__box">
            <h2>Join</h2>
            <input name="username" placeholder="Display name" autoComplete="off" value={username} onChange={this.onInputUpdate} />
            <input name="room" placeholder="Room" autoComplete="off" value={room} onChange={this.onInputUpdate} />
            <button onClick={this.join}>Join</button>
          </form>
        </div>
      </div>
    )
  }
}

export default withRouter(Join);
