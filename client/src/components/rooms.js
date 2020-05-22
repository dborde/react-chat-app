import React from 'react';

export const Rooms = (props) => {
  return (
    <React.Fragment>
      {props.rooms.map((room, index) => typeof room !== 'undefined' ? (
        <option key={index}>{room}</option>
      ) : null )}
    </React.Fragment>
  )
}

export const ActiveRooms = (props) => {
  return (
    <React.Fragment>
      <h3 className="list-title">Active Rooms</h3>
      <ul className="rooms">
      {props.rooms.map((room, index) => typeof room !== 'undefined' ? (
        <li className="switch-room" key={index}><button onClick={()=>props.switchRoom(room)}>{room}</button></li>
      ) : null )}
      </ul>
    </React.Fragment>
  )
}