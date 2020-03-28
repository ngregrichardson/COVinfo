import React, { useEffect, useRef, useState } from "react";
import { Send } from "react-feather";
import { Scrollbars } from "react-custom-scrollbars";
import ChatMessage from "./chatMessage";
import openSocket from "socket.io-client";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";

function Chat(props) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const scrollBar = useRef(null);
  const { addToast } = useToasts();

  useEffect(() => {
    document.title = "Chat | COVInfo";
    const socket = openSocket("http://localhost:4000");
    socket.on("message", (msg) => {
      setMessages([...messages, msg]);
      scrollToBottom();
    });
    return function cleanup() {
      socket.disconnect();
    };
  }, []);

  let scrollToBottom = () => {
    scrollBar.current.scrollToBottom();
  };

  let sendMessage = () => {
    fetch(
      encodeURI(
        `http://localhost:4000/sendMessage?message=${message}&username=${props.user.username}&username_color=${props.user.username_color}`
      ),
      { method: "POST" }
    )
      .then((res) => {
        setMessage("");
      })
      .catch((e) => {
        console.log(e);
        addToast("There was a problem sending the message.", {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  let _handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      sendMessage();
    }
  };

  return (
    <div className="w-100 h-100 d-flex flex-column">
      <div className="flex pl-3 pt-3 pr-3 d-flex flex-column">
        <h3>Quarantine Chat</h3>
        <Scrollbars
          renderView={(props) => <div {...props} className="pr-3 flex" />}
          ref={scrollBar}
        >
          {messages.map((msg) => (
            <ChatMessage
              message={msg}
              key={`${msg.username}_${Math.random() * 10}`}
            />
          ))}
        </Scrollbars>
      </div>
      <div className="w-100 p-3">
        <div className="w-100 d-flex flex-row rounded-pill messageInputContainer">
          <input
            type={"text"}
            className="flex bg-transparent border-0 py-2 px-3 messageInput"
            placeholder={
              props.authed ? "Message..." : "Login to enable chat..."
            }
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={_handleKeyPress}
            value={message}
            disabled={!props.authed}
          />
          {message.trim() !== "" ? (
            <button
              className="bg-primary border-0 d-flex align-items-center justify-content-center pl-3 pr-4"
              style={{
                borderTopRightRadius: 100,
                borderBottomRightRadius: 100,
              }}
              onClick={sendMessage}
            >
              <Send color={"white"} />
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}

let mapStateToProps = (state, ownProps) => {
  return { ...ownProps, user: state.user, authed: state.authed };
};

export default connect(mapStateToProps)(Chat);
