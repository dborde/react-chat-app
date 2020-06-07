import React, { useContext } from "react";
import ChatContext from "../context/chat-context";

const MessageForm = () => {
  const {
    handleSubmit,
    sendLocation,
    onInputUpdate,
    textInput,
    message,
    disabled,
  } = useContext(ChatContext);

  return (
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
            <i
              className="tooltip fab fa-telegram-plane"
              alt="send message"
              title="send message"
            >
              <span className="tooltiptext">Send Message</span>
            </i>
          </button>
          <button
            disabled={disabled}
            id="send-location"
            className="btn"
            onClick={(e) => sendLocation(e)}
          >
            <i
              className="tooltip far fa-compass"
              alt="send location"
              title="send location"
            >
              <span className="tooltiptext">Send Location</span>
            </i>
          </button>
        </div>
      </form>
    </div>
  );
};

export { MessageForm as default };
