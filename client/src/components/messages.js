import React from 'react';

const Messages = (props) => {
  return (<div>
    {props.data.map((obj, index) => typeof obj.username !== 'undefined' ? (
      <div key={index} className="message">
      <p>
        <span className="message__name">{obj.username}</span>
        <span className="message__meta">{obj.createdAt}</span>
      </p>
      {obj.url ? (<p><a href={obj.url} target="_blank" rel="noopener noreferrer">My current location</a></p>) : (<p>{obj.message}</p>) }
    </div>
    ) : null )}
    </div>);
  }

  export default Messages;
