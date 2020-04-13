import React from "react";
import ReactCountryFlag from "react-country-flag";

function ChatMessage(props) {
  return (
    <div className="mb-2 chatMessage bg-white p-2">
      <div className="d-flex flex-row align-items-center mb-1">
        <h6
          style={{ color: "#" + props.message.username_color }}
          className="mb-0 font-weight-bold"
        >
          {props.message.username}
        </h6>
        <ReactCountryFlag
          countryCode={props.message.country}
          className="ml-1"
        />
      </div>
      <span className="ml-2">{props.message.message}</span>
    </div>
  );
}

export default ChatMessage;
