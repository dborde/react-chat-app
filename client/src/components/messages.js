import React from 'react';

export const Messages = (props) => {
  return (<React.Fragment>
    {props.data.map((obj, index) => typeof obj.username !== 'undefined' ? (
      <div key={index} className="message">
      <p>
        <span className="message__name">{obj.username}</span>
        <span className="message__meta">{obj.createdAt}</span>
      </p>
      <p>{obj.message}</p>
    </div>
    ) : null )}
    </React.Fragment>);
  }

  export default Messages;
