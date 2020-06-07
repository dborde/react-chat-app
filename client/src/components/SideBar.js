import React, { useState, useEffect, useContext } from "react";
import ChatContext from "../context/chat-context";
import Users from "./Users";
import { ActiveRooms } from "./Rooms";

const SideBar = () => {
  const {
    isSideBarActive,
    rooms,
    switchRoom,
    roomData,
    toggleSideBar
  } = useContext(ChatContext);

  const [positionStart, setPositionStart] = useState(0)
  const [positionEnd, setPositionEnd] = useState(0)
  
  useEffect(() => {
    const swipe = document.getElementById('sidebar');
    swipe.addEventListener('touchstart', e => {
      setPositionStart(e.changedTouches[0].screenX);
    });
    swipe.addEventListener('touchend', e => {
      setPositionEnd(e.changedTouches[0].screenX);
    });

    return () => {
      swipe.removeEventListener('touchstart', e => {
        setPositionStart(e.changedTouches[0].screenX);
      });
      swipe.removeEventListener('touchend', e => {
        setPositionEnd(e.changedTouches[0].screenX);
      }); 
    }
    
  }, []);
  
  useEffect(() => {
    if (positionEnd < positionStart && Math.abs(positionEnd - positionStart) > 70) {
      toggleSideBar();
    }
  }, [positionEnd]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <React.Fragment>
      <i
        onClick={toggleSideBar}
        className={`mobile-menu fas fa-bars ${isSideBarActive ? "active" : ""}`}
      ></i>
      <div
        id="sidebar"
        className={`chat__sidebar ${isSideBarActive ? "active" : ""}`}
        style={{ height: window.innerHeight }}
      >
        <div id="sidebar-users">
          <Users roomData={roomData} />
        </div>
        <div id="sidebar-rooms">
          <ActiveRooms
            rooms={rooms}
            currentRoom={roomData.room}
            switchRoom={switchRoom}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export { SideBar as default };
