import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import io from "socket.io-client";
import LoaderSkeleton from "../components/loader";
import moment from "moment";
import Messages from "../components/messages";
import Users from "../components/users";
import { ActiveRooms } from "../components/rooms";

const ENDPOINT = process.env.NODE_ENV === 'production' ? "https://borde-react-chat-app.herokuapp.com/" : "http://localhost:5000";

const socket = io(ENDPOINT);

const initialState = {
  disabled: false,
  fetchingLocation: false,
  isSideBarActive: false,
  message: '',
  messages: [],
  room: '',
  rooms: [],
  users: []
}

class Chat extends Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.state = {
      ...initialState
    }
  }

  componentDidMount() {
    const params = {
      username: this.props.match.params.username,
      room: this.props.match.params.room
    }
    socket.emit('join', params, (error) => {
      if (error) {
        alert(error);
        // this.props.history.push('/');
        window.location.href = '/';
      }
    });

    socket.on('message', (message) => {
      const data = {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
      }
      this.textInput?.current && this.textInput.current.focus();
      this.setState({messages: [...this.state.messages, data]}, () => this.autoscroll());
    });

    socket.on('locationMessage', (message) => {
      const data = {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
      }
      this.setState({messages: [...this.state.messages, data]}, () => this.autoscroll());
    });

    socket.on('roomData', ({room, users}) => {
      this.setState({users, room});
    });

    socket.on('roomsList', ({rooms}) => {
      this.setState({rooms});
    });
  }

  autoscroll = () => {
    const $messagesWrap = document.querySelector('#messages');
    const $messages = document.querySelector('#messages div');
    // New message element
    const $newMessage = $messages.lastElementChild;
    if ($newMessage !== null) {
      // Height of the new message
      const newMessageStyles = getComputedStyle($newMessage);
      const newMessageMargin = parseInt(newMessageStyles.marginBottom);
      const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

      // Visible height
      const visibleHeight =  $messagesWrap.offsetHeight;

      // Height of messages container
      const containerHeight = $messages.scrollHeight;
      
      // How far have I scrolled
      const scrollOffset = $messagesWrap.scrollTop + visibleHeight;
   
      if (containerHeight - newMessageHeight <= scrollOffset) {
        // scroll to bottom
        $messagesWrap.scrollTop = $messagesWrap.scrollHeight
      }
    }
  }

  join = () => {
    const { username, room } = this.state;
    if (username && room) {
      this.props.history.push(`/chat/${username}/${room}`)
    }
  }

  toggleSideBar = () => {
    this.setState({isSideBarActive: !this.state.isSideBarActive})
  }

  onInputUpdate = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });
  }

  clearForm() {
    this.setState({
        message: ''
    });
  } 

  handleSubmit = e => {
    e.preventDefault();
    const message = this.state.message;
    this.setState({ disabled: true });
    socket.emit('sendMessage', message, (error) => {
      this.setState({ disabled: false });
      this.clearForm();

       if (error) {
        return console.log(error)
      }
    })  
  };

  switchRoom = (newroom) => {
    const username = this.props.match.params.username
    
    socket.emit('switchRoom', username, newroom );

    // this.props.history.push(`/chat/${username}/${newroom}`)
    window.location.href = `/chat/${username}/${newroom}`
    
  }

  sendLocation = e => {
    e.preventDefault();
    if (!navigator.geolocation) {
      return alert('Geolocation is not supported by your browser.')
    }
    
    this.setState({ disabled: true, fetchingLocation: true });
  
    navigator.geolocation.getCurrentPosition((position) => {
      socket.emit('sendLocation', {
        lat: position.coords.latitude,
        long: position.coords.longitude
      }, () => {
        this.setState({ disabled: false, fetchingLocation: false });
      })
    });
  }

  render() {
    const { disabled, fetchingLocation, isSideBarActive, message, messages, room, rooms, users } = this.state;
    return (
      <React.Fragment>
        <div className="chat" style={{height: window.innerHeight}}>
          <i onClick={this.toggleSideBar} className={`mobile-menu fas fa-bars ${isSideBarActive ? "active" : ""}`}></i>
          <div id="sidebar" className={`chat__sidebar ${isSideBarActive ? "active" : ""}`} style={{height: window.innerHeight}}>
            <div id="sidebar-users">
              <Users users={users} room={room}/>
            </div>
            <div id="sidebar-rooms">
              <ActiveRooms rooms={rooms} switchRoom={this.switchRoom}/>
            </div>
          </div>

          <div className={`chat__main ${isSideBarActive ? "active" : ""}`} style={{height: window.innerHeight}}>
            {fetchingLocation && <LoaderSkeleton height={`${window.innerHeight}px`} />}
            <div id="messages" className="chat__messages">
              <Messages data={messages} />
            </div>
            <div className="compose" onSubmit={(e) => this.handleSubmit(e)}>
              <form id="message-form">
                <input
                  name="message"
                  placeholder="Type your message..."
                  autoComplete="off"
                  value={message}
                  onChange={this.onInputUpdate}
                  ref={this.textInput}
                />
                <div className="btnWrap">
                  <button disabled={disabled} type="submit" className="btn">
                    <i className="tooltip fab fa-telegram-plane" alt="send message" title="send message">
                      <span className="tooltiptext">Send Message</span>
                    </i>
                  </button>
                  <button disabled={disabled} id="send-location" className="btn" onClick={(e) => this.sendLocation(e)}>
                    <i className="tooltip far fa-compass" alt="send location" title="send location">
                      <span className="tooltiptext">Send Location</span>
                    </i>         
                  </button>
                </div>    
              </form>
            </div>

          </div>

        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(Chat);
