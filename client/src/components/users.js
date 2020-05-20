import React from 'react';

const Users = (props) => {
  return (
    <React.Fragment>
      <h2 className="room-title">{props.room}</h2>
      <h3 className="list-title">Users</h3>
      <ul className="users">
        {props.users.map((obj, index) => (
          <li key={index}>{obj.username}</li>
          ))}
      </ul>
    </React.Fragment>
  );
}

export default Users;
