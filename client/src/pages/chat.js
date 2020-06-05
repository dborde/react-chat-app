import React, { useEffect, useState, useReducer } from 'react';
import { withRouter } from 'react-router-dom';
import io from "socket.io-client";
import LoaderSkeleton from "../components/loader";
import moment from "moment";
import Messages from "../components/Messages";
import Users from "../components/Users";
import { ActiveRooms } from "../components/Rooms";

const ENDPOINT = process.env.NODE_ENV === 'production' ? "https://borde-react-chat-app.herokuapp.com/" : "http://localhost:5000";
const socket = io(ENDPOINT);

const messagesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_MESSAGE':
      return action.message
    case 'SET_MESSAGES':
      return [
        ...state,
        action.data
      ]
    default:
      return state
  }
}

const Chat = (props) =>{
  const textInput = React.useRef();
  const [messages, dispatchMessages] = useReducer(messagesReducer, []);
  const [disabled, setDisabled] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [isSideBarActive, setIsSideBarActive] = useState(false);
  const [message, setMessage] = useState('');
  const [rooms, setRooms] = useState([]);
  const [roomData, setRoomData] = useState({room: '', users: []});
    
  useEffect(() => {
    const params = {
      username: props.match.params.username,
      room: props.match.params.room
    }

    socket.emit('join', params, (error) => {
      if (error) {
        alert(error);
        props.history.push('/');
      }
    });

    socket.on('roomData', ({room, users}) => {
      setRoomData({room, users})
    });

    socket.on('roomsList', ({rooms}) => {
      setRooms(rooms);
      
    });

  }, [props.match.params.username, props.match.params.room, props.history]);

  useEffect(() => {
    socket.on('message', (message) => {
      const data = {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
      }
      textInput?.current && textInput.current.focus();
      dispatchMessages({ type: 'SET_MESSAGES', data });

      autoscroll();
      
    });

    socket.on('locationMessage', (message) => {
      const data = {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
      }
      dispatchMessages({ type: 'SET_MESSAGES', data });

      autoscroll();
      
    });

  }, []);

  const autoscroll = () => {
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

  const toggleSideBar = () => {
    setIsSideBarActive(!isSideBarActive);
  }

  const onInputUpdate = e => {
    setMessage(e.target.value);
  }

  const clearForm = () => {
    setMessage('');
  } 

  const handleSubmit = e => {
    e.preventDefault();
    setDisabled(true)
    socket.emit('sendMessage', message, (error) => {
      setDisabled(false);
      clearForm();

       if (error) {
        return console.log(error)
      }
    })  
  };

  const switchRoom = (newroom) => {
    const username = props.match.params.username;

    socket.emit('switchRoom', username, newroom );
      props.history.push(`/chat/${username}/${newroom}`);
  }

  const sendLocation = e => {
    e.preventDefault();
    if (!navigator.geolocation) {
      return alert('Geolocation is not supported by your browser.')
    }
    
    setDisabled(true);
    setFetchingLocation(true);
  
    navigator.geolocation.getCurrentPosition((position) => {
      socket.emit('sendLocation', {
        lat: position.coords.latitude,
        long: position.coords.longitude
      }, () => {
        setDisabled(false);
        setFetchingLocation(false);
      })
    });
  }

  return (
    <React.Fragment>
      <div className="chat" style={{height: window.innerHeight}}>
        <i onClick={toggleSideBar} className={`mobile-menu fas fa-bars ${isSideBarActive ? "active" : ""}`}></i>
        <div id="sidebar" className={`chat__sidebar ${isSideBarActive ? "active" : ""}`} style={{height: window.innerHeight}}>
          <div id="sidebar-users">
            <Users roomData={roomData}/>
          </div>
          <div id="sidebar-rooms">
            <ActiveRooms rooms={rooms} currentRoom={roomData.room} switchRoom={switchRoom} />
          </div>
        </div>

        <div className={`chat__main ${isSideBarActive ? "active" : ""}`} style={{height: document.documentElement.clientHeight}}>
          {fetchingLocation && <LoaderSkeleton height={`${window.innerHeight}px`} />}
          <div id="messages" className="chat__messages">
            <Messages data={messages} />
          </div>

          <div className="compose" onSubmit={(e) => handleSubmit(e)}>
            <form id="message-form">
              <input
                name="message"
                placeholder="Type your message..."
                autoComplete="off"
                value={message}
                onChange={onInputUpdate}
                ref={textInput}
              />
              <div className="btnWrap">
                <button disabled={disabled} type="submit" className="btn">
                  <i className="tooltip fab fa-telegram-plane" alt="send message" title="send message">
                    <span className="tooltiptext">Send Message</span>
                  </i>
                </button>
                <button disabled={disabled} id="send-location" className="btn" onClick={(e) => sendLocation(e)}>
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

export default withRouter(Chat);
