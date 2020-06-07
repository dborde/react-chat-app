import React, { useContext } from "react";
import ChatContext from "../context/chat-context";

/**
 * messages id and child div are referenced in utils/autoscroll.js
 */

const Messages = () => {
  const { messages } = useContext(ChatContext);

  return (
    <div id="messages" className="chat__messages">
      <div>
        {messages.map((obj, index) =>
          typeof obj.username !== "undefined" ? (
            <div key={index} className="message">
              <p>
                <span className="message__name">{obj.username}</span>
                <span className="message__meta">{obj.createdAt}</span>
              </p>
              {obj.url ? (
                <p>
                  <a href={obj.url} target="_blank" rel="noopener noreferrer">
                    My current location
                  </a>
                </p>
              ) : (
                <p>{obj.message}</p>
              )}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default Messages;
