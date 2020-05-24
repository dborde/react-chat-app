import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import io from "socket.io-client";
import { Rooms } from "../components/rooms";

const ENDPOINT = "https://borde-react-chat-app.herokuapp.com:5000"; // dev"http://localhost:5000"; 
const socket = io(ENDPOINT);

const initialState = { 
  room: '',
  rooms: [],
  username: ''
}

class Join extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState
    }
  }

  componentDidMount() {
    socket.on('roomsList', ( {rooms} ) => {
      this.setState({rooms});
    });
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
    const { room, rooms, username } = this.state;
    return (
      <div className="row">
        <div className="col-xs">
          <form className="centered-form__box">
            <h2>Join</h2>
            <input name="username" placeholder="Display name" autoComplete="off" value={username} onChange={this.onInputUpdate} />
            <input type="text" list="rooms" name="room" placeholder="Room" autoComplete="off" value={room} onChange={this.onInputUpdate} />
            <datalist id="rooms">
              <Rooms rooms={rooms} />
            </datalist>
            <button onClick={this.join}>Join</button>
          </form>
        </div>
      </div>
    )
  }
}

export default withRouter(Join);
