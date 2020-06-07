import React, { useEffect, useState, useReducer } from "react";
import { withRouter } from "react-router-dom";
import io from "socket.io-client";
import moment from "moment";

import { autoscroll } from "../utils/autoscroll";
import ChatContext from "../context/chat-context";
import LoaderSkeleton from "../utils/loader";
import MessageForm from "../components/MessageForm";
import Messages from "../components/Messages";
import messagesReducer from "../reducers/messages";
import SideBar from "../components/SideBar";

const ENDPOINT =
  process.env.NODE_ENV === "production"
    ? "https://borde-react-chat-app.herokuapp.com/"
    : "http://localhost:5000";
const socket = io(ENDPOINT);

const Chat = (props) => {
  const textInput = React.useRef();
  const [messages, dispatchMessages] = useReducer(messagesReducer, []);
  const [disabled, setDisabled] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [isSideBarActive, setIsSideBarActive] = useState(false);
  const [message, setMessage] = useState("");
  const [rooms, setRooms] = useState([]);
  const [roomData, setRoomData] = useState({ room: "", users: [] });

  useEffect(() => {
    const params = {
      username: props.match.params.username,
      room: props.match.params.room,
    };

    socket.emit("join", params, (error) => {
      if (error) {
        alert(error);
        props.history.push("/");
      }
    });

    socket.on("roomData", ({ room, users }) => {
      setRoomData({ room, users });
    });

    socket.on("roomsList", ({ rooms }) => {
      setRooms(rooms);
    });
  }, [props.match.params.username, props.match.params.room, props.history]);

  useEffect(() => {
    socket.on("message", (message) => {
      const data = {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format("h:mm a"),
      };
      textInput?.current && textInput.current.focus();
      dispatchMessages({ type: "SET_MESSAGES", data });

      autoscroll();
    });

    socket.on("locationMessage", (message) => {
      const data = {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format("h:mm a"),
      };
      dispatchMessages({ type: "SET_MESSAGES", data });

      autoscroll();
    });
  }, []);

  const toggleSideBar = () => {
    setIsSideBarActive(!isSideBarActive);
  };

  const onInputUpdate = (e) => {
    setMessage(e.target.value);
  };

  const clearForm = () => {
    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDisabled(true);
    socket.emit("sendMessage", message, (error) => {
      setDisabled(false);
      clearForm();

      if (error) {
        return console.log(error);
      }
    });
  };

  const switchRoom = (newroom) => {
    const username = props.match.params.username;

    socket.emit("switchRoom", username, newroom);
    props.history.push(`/chat/${username}/${newroom}`);
  };

  const sendLocation = (e) => {
    e.preventDefault();
    if (!navigator.geolocation) {
      return alert("Geolocation is not supported by your browser.");
    }

    setDisabled(true);
    setFetchingLocation(true);

    navigator.geolocation.getCurrentPosition((position) => {
      socket.emit(
        "sendLocation",
        {
          lat: position.coords.latitude,
          long: position.coords.longitude,
        },
        () => {
          setDisabled(false);
          setFetchingLocation(false);
        }
      );
    });
  };

  return (
    <ChatContext.Provider
      value={{
        disabled,
        handleSubmit,
        isSideBarActive,
        onInputUpdate,
        message,
        messages,
        roomData,
        rooms,
        sendLocation,
        switchRoom,
        textInput,
        toggleSideBar
      }}
    >
      <div className="chat" style={{ height: window.innerHeight }}>
        <SideBar />
        <div
          className={`chat__main ${isSideBarActive ? "active" : ""}`}
          style={{ height: document.documentElement.clientHeight }}
        >
          {fetchingLocation && (
            <LoaderSkeleton height={`${window.innerHeight}px`} />
          )}
          <Messages />
          <MessageForm />
        </div>
      </div>
    </ChatContext.Provider>
  );
};

export default withRouter(Chat);
