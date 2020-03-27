import React from "react";

function ChatMessage(props) {
  return (
    <div className="mb-2 chatMessage bg-white p-2">
      <h6 style={{ color: "#" + props.message.username_color }}>
        {props.message.username}
      </h6>
      <span className="ml-2">{props.message.message}</span>
    </div>
  );
}

export default ChatMessage;
