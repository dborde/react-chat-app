import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import io from "socket.io-client";
import { Rooms } from "../components/Rooms";

const ENDPOINT =
  process.env.NODE_ENV === "production"
    ? "https://borde-react-chat-app.herokuapp.com/"
    : "http://localhost:5000";
const socket = io(ENDPOINT);

const Join = (props) => {
  const [rooms, setRooms] = useState([]);
  const [values, setValues] = useState({ room: "", username: "" });

  useEffect(() => {
    socket.on("roomsList", ({ rooms }) => {
      setRooms(rooms);
    });
  }, [rooms]);

  useEffect(() => {
    return () => socket.off("roomsList");
  }, []);

  const onInputUpdate = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const join = () => {
    const { username, room } = values;
    if (username && room) {
      props.history.push(`/chat/${username}/${room}`);
    }
  };

  return (
    <div className="row">
      <div className="col-xs">
        <form className="centered-form__box">
          <h2>Join</h2>
          <input
            name="username"
            placeholder="Display name"
            autoComplete="off"
            value={values.username}
            onChange={onInputUpdate}
          />
          <input
            type="text"
            list="rooms"
            name="room"
            placeholder="Room"
            autoComplete="off"
            value={values.room}
            onChange={onInputUpdate}
          />
          <datalist id="rooms">
            <Rooms rooms={rooms} />
          </datalist>
          <button onClick={join} type="button">
            Join
          </button>
        </form>
      </div>
    </div>
  );
};

export default withRouter(Join);
